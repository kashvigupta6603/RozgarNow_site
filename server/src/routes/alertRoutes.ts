// server/src/routes/alertRoutes.ts
import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import { sendAlertsToAllUsers, findMatchedJobsForPref } from "../controllers/notificationController";
import { mailer, sendMail } from "../services/emailService"; // mailer + helper sendMail

const router = Router();

/**
 * POST /api/alerts/subscribe
 * Subscribe a user email to alerts (sends a confirmation email).
 * No auth required here (simple subscribe).
 */
router.post("/subscribe", async (req: Request, res: Response) => {
  const { email, categories, qualifications, locations } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // verify transporter once to detect SMTP/auth issues early
    try {
      await mailer.verify();
      console.log("Mailer verified OK");
    } catch (verifyErr: unknown) {
      console.error("Mailer verify failed:", verifyErr);
      const details = verifyErr && (verifyErr as Error).message ? (verifyErr as Error).message : undefined;
      return res.status(500).json({
        success: false,
        message: "Email service not available. Check EMAIL_USER / EMAIL_PASS and SMTP access.",
        details,
      });
    }

    // optional: persist subscription in DB (uncomment if you have Subscription model)
    // await prisma.subscription.create({ data: { email, categories: categories || [], qualifications: qualifications || [], locations: locations || [] } });

    const text = `Thanks for subscribing!\n\nCategories: ${Array.isArray(categories) ? categories.join(", ") : "N/A"}`;

    // sendMail signature: sendMail(to: string, subject: string, html: string)
    const html = `<p>${text}</p>`;
    await sendMail(email, "Your Job Alerts Subscription is Active! 🎉", html);

    return res.json({ success: true, message: "Subscription confirmed, email sent." });
  } catch (err: any) {
    console.error("EMAIL ERROR (subscribe):", err);
    return res.status(500).json({
      success: false,
      message: "Email failed",
      error: err?.message ?? String(err),
    });
  }
});

/**
 * GET /api/alerts/trigger-one
 * Trigger immediate matched-jobs email for the authenticated user.
 * Protected route (authMiddleware required).
 */
router.get("/trigger-one", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any).id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { preferences: true },
    });

    if (!user || !user.preferences || user.preferences.length === 0) {
      return res.json({ success: false, message: "No preferences found" });
    }

    const pref = user.preferences[0];

    const matchedJobs = await findMatchedJobsForPref(pref);

    if (!matchedJobs || matchedJobs.length === 0) {
      return res.json({ success: false, message: "No matched jobs for you right now" });
    }

    const top = matchedJobs.slice(0, 5);

    const html = `
      <div style="font-family: Arial; line-height: 1.6;">
        <h2>Your Matched Jobs</h2>
        <ul>
          ${top
            .map(
              (j) => `
            <li style="margin-bottom:12px;">
              <strong>${j.title}</strong><br/>
              ${j.organization || ""}<br/>
              ${j.location || ""}<br/>
              Deadline: ${j.deadline || "N/A"}<br/>
              ${j.applyLink ? `<a href="${j.applyLink}" target="_blank">Apply</a>` : ""}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;

    // sendMail(to, subject, html)
    await sendMail(user.email, "Your matched jobs — RozgarNow", html);

    return res.json({ success: true, sent: true });
  } catch (err) {
    console.error("Trigger ONE error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
