// src/controllers/notificationController.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { sendMail } from "../services/emailService";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

// safely convert comma-separated string to list
function normalizeList(str?: string) {
  if (!str) return [];
  return str
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

// find any keyword inside text
function containsAny(text: string, list: string[]) {
  if (!text) return false;
  const t = text.toLowerCase();
  return list.some(x => x && t.includes(x));
}

// HTML builder
function buildEmailHtml(userName: string, jobs: any[]) {
  const items = jobs
    .map(
      (j: any) => `
      <div style="margin-bottom:18px;">
        <strong>${j.title}</strong><br/>
        ${j.organization || "Unknown"} — ${j.location || "N/A"}<br/>
        Deadline: ${j.deadline || "N/A"}<br/>
        <a href="${j.applyLink}" target="_blank">Apply</a>
      </div>
    `
    )
    .join("");

  return `
    <h2>Hello ${userName || "User"},</h2>
    <p>Here are your matched jobs:</p>
    ${items}
    <br/><hr/>
    <p>Regards,<br/>RozgarNow Team</p>
  `;
}

/* -------------------------------------------------------
   MAIN MATCHING FUNCTION
------------------------------------------------------- */
export async function findMatchedJobsForPref(pref: any) {
  const prefCategories = normalizeList(pref.category);
  const prefQualifications = normalizeList(pref.qualification);
  const prefLocations = normalizeList(pref.location);
  const prefKeywords = normalizeList(pref.keywords);
  const prefGovt = (pref.govt || "").toLowerCase();

  const jobs = await prisma.job.findMany({
    orderBy: { id: "desc" },
    take: 200,
  });

  const matched = jobs.filter(job => {
    const title = (job.title || "").toLowerCase();
    const org = (job.organization || "").toLowerCase();
    const syllabus = (job.syllabus || "").toLowerCase();
    const qreq = (job.qualificationRequired || "").toLowerCase();
    const loc = (job.location || "").toLowerCase();
    const govt = (job.govt || "").toLowerCase();

    let score = 0;

    if (prefCategories.length && containsAny(title + org + syllabus, prefCategories)) score++;
    if (prefQualifications.length && containsAny(qreq, prefQualifications)) score++;
    if (prefLocations.length && containsAny(loc, prefLocations)) score++;
    if (prefKeywords.length && containsAny(title + syllabus + org, prefKeywords)) score++;
    if (prefGovt !== "none" && prefGovt && govt.includes(prefGovt)) score++;

    return score > 0;
  });

  return matched;
}

/* -------------------------------------------------------
   SEND ALERTS TO ALL USERS
------------------------------------------------------- */
export async function sendAlertsToAllUsers(req: Request | null, res?: Response) {
  try {
    const users = await prisma.user.findMany({
      include: { preferences: true },
    });

    let totalSent = 0;

    for (const user of users) {
      const pref = user.preferences?.[0];
      if (!pref) continue;

      const matched = await findMatchedJobsForPref(pref);
      if (!matched.length) continue;

      const top = matched.slice(0, 5);
      const html = buildEmailHtml(user.name || user.email, top);

      try {
        await sendMail(
          user.email,
          "New Jobs Matching Your Preferences — RozgarNow",
          html
        );
        totalSent++;
      } catch (err) {
        console.error("Email failed to:", user.email, err);
      }
    }

    if (res)
      return res.json({ success: true, sent: totalSent });

    return { success: true, sent: totalSent };
  } catch (err) {
    console.error("sendAlertsToAllUsers ERROR:", err);
    if (res)
      return res.status(500).json({ success: false, message: "Failed" });
    throw err;
  }
}
