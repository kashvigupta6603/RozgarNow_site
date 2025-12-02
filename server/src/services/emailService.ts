import axios from "axios";

const API_KEY = process.env.BREVO_API_KEY;

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "RozgarNow",
          email: "gupta7_be23@thapar.edu"   // VERIFIED SENDER ONLY!!
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Mail sent", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Brevo Email Error:", err.response?.data || err);
    throw err;
  }
}
