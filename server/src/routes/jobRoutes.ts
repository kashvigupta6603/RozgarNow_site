import express from "express";
import { fetchJobsFromApi } from "../controllers/fetchJobsFromApi";
import prisma from "../prisma";
import { getMatchingJobs } from "../controllers/jobMatchController";
import  authMiddleware  from "../middleware/authMiddleware";

const router = express.Router();

// ⬇️ Fetch and save external API jobs
router.post("/fetch", fetchJobsFromApi);
router.get("/fetch", fetchJobsFromApi);

// ⬇️ Get all stored jobs
router.get("/all", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { id: "desc" },
    });
    return res.json({ success: true, total: jobs.length, jobs });
  } catch (error) {
    console.error("Error fetching jobs from DB:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch jobs" });
  }
});

// ⬇️ ⭐⭐ NEW: Get jobs matching logged-in user's preferences
router.get("/matching", authMiddleware, getMatchingJobs);


export default router;
