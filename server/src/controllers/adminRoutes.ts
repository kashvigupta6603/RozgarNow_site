// src/routes/adminRoutes.ts
import { Router, Request, Response } from "express";
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import { fetchJobsFromApi } from "../controllers/fetchJobsFromApi";
import { sendAlertsToAllUsers } from "../controllers/notificationController";
import crypto from "crypto";

const router = Router();

interface AuthedRequest extends Request {
  user?: { id: number };
}

async function ensureAdmin(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
    },
  });

  if (!user || !user.isAdmin) {
    res.status(403).json({ message: "Admins only" });
    return null;
  }

  return user;
}

/* -----------------------------------------
   1) Admin stats
------------------------------------------*/
router.get("/stats", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  try {
    const admin = await ensureAdmin(typedReq, res);
    if (!admin) return;

    const [userCount, jobCount, prefCount] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.preference.count(),
    ]);

    return res.json({
      success: true,
      users: userCount,
      jobs: jobCount,
      preferences: prefCount,
    });
  } catch (err) {
    console.error("Admin /stats error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -----------------------------------------
   2) Trigger job fetch
------------------------------------------*/
router.post("/fetch-jobs", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  const admin = await ensureAdmin(typedReq, res);
  if (!admin) return;

  return fetchJobsFromApi(req, res);
});

/* -----------------------------------------
   3) Send job-match alerts
------------------------------------------*/
router.post("/send-alerts", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  const admin = await ensureAdmin(typedReq, res);
  if (!admin) return;

  return sendAlertsToAllUsers(null, res);
});

/* -----------------------------------------
   4) USERS LIST
------------------------------------------*/
router.get("/users", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  const admin = await ensureAdmin(typedReq, res);
  if (!admin) return;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return res.json({ success: true, users });
});

/* -----------------------------------------
   5) JOBS LIST (Admin)
------------------------------------------*/
router.get("/jobs", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  const admin = await ensureAdmin(typedReq, res);
  if (!admin) return;

  const jobs = await prisma.job.findMany({
    orderBy: { id: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      organization: true,
      location: true,
      deadline: true,
      qualificationRequired: true,
      applyLink: true,
    },
  });

  return res.json({ success: true, jobs });
});

/* -----------------------------------------
   6) PREFERENCES LIST
------------------------------------------*/
router.get("/preferences", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  const admin = await ensureAdmin(typedReq, res);
  if (!admin) return;

  const prefs = await prisma.preference.findMany({
    orderBy: { id: "desc" },
    take: 100,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return res.json({ success: true, prefs });
});

/* -----------------------------------------
   7) CREATE JOB
------------------------------------------*/
router.post("/jobs", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  try {
    const admin = await ensureAdmin(typedReq, res);
    if (!admin) return;

    const {
      title,
      organization,
      location,
      deadline,
      qualificationRequired,
      syllabus,
      applyLink,
      age,
      experience,
      govt,
    } = req.body;

    if (!title || !organization) {
      return res
        .status(400)
        .json({ success: false, message: "Title & organization required" });
    }

    const hashSource = `${title}||${organization}||${deadline || ""}||manual`;
    const jobHash = crypto.createHash("sha256").update(hashSource).digest("hex");

    const job = await prisma.job.create({
      data: {
        jobHash,
        title,
        organization,
        location,
        deadline,
        qualificationRequired,
        syllabus,
        applyLink,
        age: age ? Number(age) : null,
        experience,
        govt,
      },
    });

    return res.json({ success: true, job });
  } catch (err) {
    console.error("Admin create job error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create job" });
  }
});

/* -----------------------------------------
   8) DELETE JOB
------------------------------------------*/
router.delete("/jobs/:id", authMiddleware, async (req, res) => {
  const typedReq = req as AuthedRequest;

  try {
    const admin = await ensureAdmin(typedReq, res);
    if (!admin) return;

    const jobId = Number(req.params.id);
    if (isNaN(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job id" });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return res.json({ success: true, message: "Job deleted" });
  } catch (err: any) {
    console.error("Admin delete job error:", err);

    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Failed to delete job" });
  }
});

export default router;
