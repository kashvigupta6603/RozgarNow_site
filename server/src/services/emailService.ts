import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// optional verify
transporter.verify()
  .then(() => console.log("✅ SMTP Verified OK"))
  .catch((err) => console.error("❌ SMTP Verify Failed:", err?.message, err));

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log("📨 Mail sent:", info.messageId);
    return info;
  } catch (err: any) {
  console.error("❌ sendMail Error:", err?.message || err);
  throw err;
}

}
