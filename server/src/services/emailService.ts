import axios from "axios";

const API_KEY = process.env.BREVO_API_KEY!;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL!;
const SENDER_NAME = process.env.BREVO_SENDER_NAME!;

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Mail sent ✔", response.data.messageId);
    return response.data;

  } catch (err: any) {
    console.error("❌ Brevo Email Error:", err.response?.data || err);
    throw new Error("Email failed");
  }
}
