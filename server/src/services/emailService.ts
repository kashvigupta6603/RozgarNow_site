// src/services/emailService.ts
import fetch from "node-fetch";

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.ALERT_FROM },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await res.json();
    console.log("📧 Email Sent:", data);

    if (!res.ok) throw new Error(JSON.stringify(data));

    return data;
  } catch (err) {
    console.error("❌ sendMail Error:", err);
    throw err;
  }
}
