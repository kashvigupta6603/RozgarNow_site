// src/services/emailService.ts
import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP (optional)
mailer
  .verify()
  .then(() => console.log("✅ SMTP transporter verified"))
  .catch((err) =>
    console.warn("⚠️ SMTP verify failed:", err?.message || err)
  );

export async function sendMail(
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  try {
    const info = await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text,
    });

    console.log(`📩 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ sendMail error:", err);
    throw err;
  }
}
