import { Router } from "express";
import nodemailer from "nodemailer";
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import { sendAlertsToAllUsers } from "../controllers/notificationController";
import { sendMail } from "../services/emailService";
import { findMatchedJobsForPref } from "../controllers/notificationController";




const router = Router();

/* --------------------------------------------------
-------------------------------------------------- */
router.post("/subscribe", async (req, res) => {
  const { email, categories, qualifications, locations } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Job Alerts Subscription is Active! 🎉",
      text: `Thanks for subscribing!\n\nCategories: ${categories?.join(", ")}`,
    });

    return res.json({ success: true, message: "Email sent" });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    return res.status(500).json({ success: false, message: "Email failed" });
  }
});

/* --------------------------------------------------
   2️⃣ TRIGGER FOR ALL USERS (Admin only)
-------------------------------------------------- */
router.get("/trigger-one", authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user || !user.preferences.length) {
      return res.json({
        success: false,
        message: "No preferences found",
      });
    }

    const pref = user.preferences[0];

    // USE REAL IMPORT, NOT REQUIRE
    const matchedJobs = await findMatchedJobsForPref(pref);

    if (!matchedJobs.length) {
      return res.json({
        success: false,
        message: "No matched jobs for you right now",
      });
    }

    const top = matchedJobs.slice(0, 5);

    const html = `
      <div style="font-family: Arial; line-height: 1.6;">
        <h2>Your Matched Jobs</h2>
        <ul>
          ${top
            .map(
              (j) => `
            <li>
              <strong>${j.title}</strong><br/>
              ${j.organization}<br/>
              ${j.location}<br/>
              Deadline: ${j.deadline}<br/>
              <a href="${j.applyLink}" target="_blank">Apply</a>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;

    await sendMail(user.email, "Your matched jobs — Vacantra", html);

    return res.json({ success: true, sent: true });
  } catch (err) {
    console.log("Trigger ONE error:", err);
    return res.status(500).json({ success: false });
  }
});


export default router;
