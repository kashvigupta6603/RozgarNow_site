// src/controllers/notificationController.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { sendMail } from "../services/emailService";

/**
 * Loose textual match helper
 */
function containsAny(haystack: string, needles: string[]) {
  if (!haystack) return false;
  const s = haystack.toLowerCase();
  return needles.some(n => n && s.includes(n));
}

function normalizeList(str?: string) {
  if (!str) return [];
  return str
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Build a small HTML email for matched jobs
 */
function buildEmailHtml(userName: string | null, jobs: any[]) {
  const header = `<h2>Hi ${userName || "there"},</h2>
    <p>We found <strong>${jobs.length}</strong> job(s) that may match your preferences. Click the links to view details and apply.</p>`;

  const list = jobs
    .map(j => {
      const title = j.title || "No title";
      const org = j.organization || "Unknown";
      const location = j.location || "Not specified";
      const deadline = j.deadline || "Not specified";
      const apply = j.applyLink ? `<a href="${j.applyLink}" target="_blank">Apply</a>` : "Apply link not available";
      return `<li style="margin-bottom:12px">
        <strong>${title}</strong><br/>
        <small>${org} — ${location} — Deadline: ${deadline}</small><br/>
        ${apply}
      </li>`;
    })
    .join("");

  const footer = `<p style="margin-top:18px">To manage your preferences or stop these emails, visit your profile on the site.</p>
    <p>Regards,<br/>RozgarNow Team</p>`;

  return `<div>${header}<ul style="list-style:none;padding-left:0">${list}</ul>${footer}</div>`;
}

/**
 * Core function that for a single user's preferences returns matched jobs (loose/fuzzy)
 */
 export async function findMatchedJobsForPref(pref: any) {
  // normalize prefs
  const categories = normalizeList(pref?.category);
  const qualifications = normalizeList(pref?.qualification);
  const locations = normalizeList(pref?.location);
  const keywords = normalizeList(pref?.keywords);
  const govtPref = (pref?.govt || "").toLowerCase();

  // fetch all jobs (could be optimized to DB query later)
  const jobs = await prisma.job.findMany({
    orderBy: { id: "desc" },
    take: 200, // limit for performance
  });

  const matched = jobs.filter(job => {
    const title = (job.title || "").toLowerCase();
    const syllabus = (job.syllabus || "").toLowerCase();
    const qreq = (job.qualificationRequired || "").toLowerCase();
    const loc = Array.isArray(job.location) ? job.location.join(" ").toLowerCase() : (job.location || "").toLowerCase();
    const jobGovt = (job.govt || "").toLowerCase();
    const org = (job.organization || "").toLowerCase();

    let score = 0;

    if (categories.length && containsAny(title + " " + syllabus + " " + org, categories)) score++;
    if (qualifications.length && containsAny(qreq, qualifications)) score++;
    if (locations.length && (containsAny(loc, locations) || loc.includes("india") || loc.includes("all over india"))) score++;
    if (keywords.length && containsAny(title + " " + syllabus + " " + org, keywords)) score++;
    if (govtPref && govtPref !== "none" && jobGovt.includes(govtPref)) score++;

    // decide threshold: accept if score>0 (loose)
    return score > 0;
  });

  return matched;
}

/**
 * Send alerts to all users (callable via route or cron).
 * This sends a single email per user containing top 5 matched jobs (if any).
 */
export async function sendAlertsToAllUsers(req: Request | null, res?: Response) {
  try {
    // load all users who have preferences
    const users = await prisma.user.findMany({
      include: {
        preferences: true,
      },
    });

    let totalEmails = 0;
    for (const user of users) {
      // get preference record (assuming at most one)
      const pref = user.preferences && user.preferences.length ? user.preferences[0] : null;
      if (!pref) continue;

      const matchedJobs = await findMatchedJobsForPref(pref);
      if (!matchedJobs || matchedJobs.length === 0) continue;

      // send top 5 matches
      const top = matchedJobs.slice(0, 5);
      const html = buildEmailHtml(user.name || user.email, top);

      try {
        await sendMail(user.email, "New jobs matching your preferences — RozgarNow", html);
        totalEmails++;
      } catch (err) {
        console.error("Failed sending email to", user.email, err);
      }
    }

    console.log(`sendAlertsToAllUsers -> emails sent: ${totalEmails}`);

    if (res) {
      return res.json({ success: true, sent: totalEmails });
    }
    return { success: true, sent: totalEmails };
  } catch (err) {
    console.error("sendAlertsToAllUsers error:", err);
    if (res) {
      return res.status(500).json({ success: false, message: "Failed to send alerts" });
    }
    throw err;
  }
}
