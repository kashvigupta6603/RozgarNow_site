// src/services/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT), // 587
  secure: false, // BREVO uses TLS
  auth: {
    user: process.env.SMTP_USER, // "apikey"
    pass: process.env.SMTP_PASS, // Brevo SMTP key
  },
});

// Optional verify
transporter.verify().then(() => {
  console.log("✅ Brevo SMTP ready");
}).catch(err => {
  console.error("❌ Brevo SMTP ERROR:", err);
});

export async function sendMail(to: string, subject: string, html: string) {
  const fromEmail = process.env.EMAIL_FROM;

  return transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html,
  });
}
