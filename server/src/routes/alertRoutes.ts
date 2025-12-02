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
      email,  // <-- yeh sahi hai, kyunki upar destructure kiya hai
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
    const matched = await findMatchedJobsForPref(pref);

    if (!matched.length) {
      return res.json({ success: false, message: "No matched jobs now" });
    }

    const topJobs = matched.slice(0, 5).map(j => `
      <p>
        <strong>${j.title}</strong><br/>
        ${j.organization}<br/>
        ${j.location}<br/>
        Deadline: ${j.deadline}<br/>
        <a href="${j.applyLink}" target="_blank">Apply</a>
      </p>
    `).join("");

    await sendMail(
      user.email,
      "Your Matched Jobs — RozgarNow",
      `<h2>Your Job Matches</h2>${topJobs}`
    );

    return res.json({ success: true, sent: true });
  } catch (err) {
    console.error("Trigger Error:", err);
    return res.status(500).json({ success: false });
  }
});


export default router;
