import { Request, Response } from "express";
import prisma from "../prisma";

export const getMatchingJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Fetch user preferences
    const pref = await prisma.preference.findUnique({ where: { userId } });

    if (!pref) {
      return res.status(404).json({ success: false, message: "No preferences found" });
    }

    // Convert to arrays (LOWERCASE)
    const categories = pref.category ? pref.category.toLowerCase().split(",").map(x => x.trim()) : [];
    const qualifications = pref.qualification ? pref.qualification.toLowerCase().split(",").map(x => x.trim()) : [];
    const locations = pref.location ? pref.location.toLowerCase().split(",").map(x => x.trim()) : [];
    const keywords = pref.keywords ? pref.keywords.toLowerCase().split(",").map(x => x.trim()) : [];
    const govtPref = pref.govt ? pref.govt.toLowerCase() : "";

    // Fetch all jobs
    const jobs = await prisma.job.findMany();

    const matchedJobs = jobs.filter(job => {
      const title = (job.title || "").toLowerCase();
      const org = (job.organization || "").toLowerCase();
      const qreq = (job.qualificationRequired || "").toLowerCase();
      const loc = (job.location || "").toLowerCase();
      const govt = (job.govt || "").toLowerCase();
      const syllabus = (job.syllabus || "").toLowerCase();

      // SCORE based matching
      let score = 0;

      // CATEGORY MATCH (title, syllabus, organization)
      if (categories.length) {
        if (categories.some(c => title.includes(c) || syllabus.includes(c) || org.includes(c))) {
          score += 1;
        }
      }

      // QUALIFICATION MATCH
      if (qualifications.length) {
        if (qualifications.some(q => qreq.includes(q))) {
          score += 1;
        }
      }

      // LOCATION MATCH
      if (locations.length) {
        if (locations.some(l => loc.includes(l))) {
          score += 1;
        }
      }

      // KEYWORD MATCH
      if (keywords.length) {
        if (keywords.some(k => title.includes(k) || syllabus.includes(k) || org.includes(k))) {
          score += 1;
        }
      }

      // GOVT MATCH
      if (govtPref && govtPref !== "none") {
        if (govt.includes(govtPref)) {
          score += 1;
        }
      }

      // 🔥 ACCEPT IF AT LEAST ONE FILTER MATCHES
      return score > 2;
    });

    return res.json({
      success: true,
      total: matchedJobs.length,
      jobs: matchedJobs
    });

  } catch (err) {
    console.log("JOB MATCH ERROR:", err);
    return res.status(500).json({ success: false, message: "Job matching failed" });
  }
};
