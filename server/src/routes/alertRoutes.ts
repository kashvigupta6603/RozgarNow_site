import { Router } from "express";
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import { sendMail } from "../services/emailService";
import { findMatchedJobsForPref } from "../controllers/notificationController";

const router = Router();

// ------------------ Subscribe -------------------
router.post("/subscribe", async (req, res) => {
  const { email, categories } = req.body;

  try {
    await sendMail(
      email,
      "Your Job Alerts Subscription is Active! 🎉",
      `<p>You are subscribed for job alerts.</p>
       <p>Categories: ${categories?.join(", ")}</p>`
    );

    return res.json({ success: true, message: "Subscription email sent" });
  } catch (err: any) {
    console.error("Subscribe Error:", err);
    return res.status(500).json({
      success: false,
      message: "Email failed",
      error: err.message,
    });
  }
});

// ------------------ User Trigger -------------------
router.get("/trigger-one", authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user || !user.preferences.length) {
      return res.json({ success: false, message: "No preferences found" });
    }

    const pref = user.preferences[0];
    const matched = await findMatchedJobsForPref(pref);

    if (!matched.length) {
      return res.json({ success: false, message: "No matched jobs right now" });
    }

    const html = matched.slice(0, 5).map(j => `
      <div>
        <h3>${j.title}</h3>
        <p>${j.organization} • ${j.location}</p>
        <a href="${j.applyLink}">Apply</a>
      </div>
    `).join("");

    await sendMail(
      user.email,
      "Your matched jobs — RozgarNow",
      html
    );

    return res.json({ success: true, sent: true });
  } catch (err: any) {
    console.error("Trigger ONE error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
