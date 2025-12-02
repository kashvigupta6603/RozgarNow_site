import { Router } from "express";
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import { sendMail } from "../services/emailService";
import { findMatchedJobsForPref } from "../controllers/notificationController";

const router = Router();

/* -------------------- SUBSCRIBE EMAIL -------------------- */
router.post("/subscribe", async (req, res) => {
  const { email, categories } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  try {
    await sendMail(
      email,
      "RozgarNow Alerts Subscription Active! 🎉",
      `<p>Thanks for subscribing!<br/>Categories: ${categories?.join(", ")}</p>`
    );

    return res.json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("Subscribe Email Error:", err);
    return res.status(500).json({ success: false, message: "Email failed" });
  }
});

/* -------------------- TRIGGER ONE (SEND MATCHED JOBS) -------------------- */
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
    const matchedJobs = await findMatchedJobsForPref(pref);

    if (!matchedJobs.length) {
      return res.json({ success: false, message: "No matched jobs now" });
    }

    const htmlList = matchedJobs
      .slice(0, 5)
      .map(
        (job) => `
        <div style="margin-bottom:10px">
          <strong>${job.title}</strong><br/>
          ${job.organization}<br/>
          ${job.location}<br/>
          Deadline: ${job.deadline}<br/>
          <a href="${job.applyLink}" target="_blank">Apply</a>
        </div>
      `
      )
      .join("");

    await sendMail(
      user.email,
      "Your Matched Jobs — RozgarNow",
      `<h2>Your Job Matches</h2>${htmlList}`
    );

    return res.json({ success: true, sent: true });
  } catch (err) {
    console.error("Trigger Error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
