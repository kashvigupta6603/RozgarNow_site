// src/services/emailService.ts
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// optional verify on startup (comment out if you don't want logs)
transporter.verify().then(() => {
  console.log("✅ SMTP transporter verified");
}).catch((err) => {
  console.warn("⚠️ SMTP verify failed:", err?.message || err);
});

export async function sendMail(to: string, subject: string, html: string) {
  const from = process.env.ALERT_FROM || process.env.SMTP_EMAIL;
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`📩 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ sendMail error:", err);
    throw err;
  }
}
