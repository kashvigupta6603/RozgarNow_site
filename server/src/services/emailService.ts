import axios from "axios";

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const API_KEY = process.env.BREVO_API_KEY;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "RozgarNow",
          email: "kashvigupta1612@gmail.com", // your verified Brevo email
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📨 Brevo Email Sent:", response.data);
  } catch (err: any) {
    console.error("❌ Brevo Email Error:", err.response?.data || err.message);
    throw err;
  }
}
