// src/utils/mailer.ts
import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // e.g. RozgarNow.app@gmail.com
    pass: process.env.EMAIL_PASS       // Gmail App Password (16 digit)
  }
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await mailer.sendMail({
      from: `"RozgarNow Job Alerts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};
