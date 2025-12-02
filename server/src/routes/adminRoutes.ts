// src/routes/adminRoutes.ts

import { Router, Request, Response } from "express";
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import { fetchJobsFromApi } from "../controllers/fetchJobsFromApi";
import { sendAlertsToAllUsers } from "../controllers/notificationController";

const router = Router();

/* -------------------------------------------------------
   Helper: Check if current user is an admin
--------------------------------------------------------*/
async function ensureAdmin(req: Request, res: Response) {
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
      isAdmin: true, // TS can infer properly
    },
  });

  if (!user || !user.isAdmin) {
    res.status(403).json({ message: "Admins only" });
    return null;
  }

  return user;
}
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "Admin route mounted" });
});

/* -------------------------------------------------------
   1) Admin Stats (Users, Jobs, Preferences)
--------------------------------------------------------*/
router.get("/stats", authMiddleware, async (req: Request, res: Response) => {
  try {
    const admin = await ensureAdmin(req, res);
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

/* -------------------------------------------------------
   2) Trigger Job Fetch (Reuses existing controller)
--------------------------------------------------------*/
router.post(
  "/fetch-jobs",
  authMiddleware,
  async (req: Request, res: Response) => {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    return fetchJobsFromApi(req, res);
  }
);

/* -------------------------------------------------------
   3) Send Job-Matching Alerts To All Users
--------------------------------------------------------*/
router.post(
  "/send-alerts",
  authMiddleware,
  async (req: Request, res: Response) => {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    return sendAlertsToAllUsers(null, res);
  }
);

/* -------------------------------------------------------
   4) USERS LIST
--------------------------------------------------------*/
router.get("/users", authMiddleware, async (req: Request, res: Response) => {
  const admin = await ensureAdmin(req, res);
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

  res.json({ success: true, users });
});

/* -------------------------------------------------------
   5) JOBS LIST
--------------------------------------------------------*/
router.get("/jobs", authMiddleware, async (req: Request, res: Response) => {
  const admin = await ensureAdmin(req, res);
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
    },
  });

  res.json({ success: true, jobs });
});

/* -------------------------------------------------------
   6) PREFERENCES LIST
--------------------------------------------------------*/
router.get(
  "/preferences",
  authMiddleware,
  async (req: Request, res: Response) => {
    const admin = await ensureAdmin(req, res);
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

    res.json({ success: true, prefs });
  }
);

export default router;
