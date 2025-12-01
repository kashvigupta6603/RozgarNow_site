import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
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
