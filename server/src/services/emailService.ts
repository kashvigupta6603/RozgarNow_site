import axios from "axios";

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "RozgarNow", email: process.env.ALERT_FROM },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Mail sent:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Brevo Email Error:", err.response?.data || err.message);
    throw new Error("Email failed");
  }
}
