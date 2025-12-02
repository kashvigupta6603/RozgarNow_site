import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import preferenceRoutes from "./routes/preferenceRoutes";
import cron from "node-cron";
import fetch from "node-fetch";
import alertRoutes from "./routes/alertRoutes";
import adminRoutes from "./routes/adminRoutes";
import { sendAlertsToAllUsers } from "./controllers/notificationController";

const app = express();

// ---------------- CORS FIX ----------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL,   // 🚀 your frontend URL from Railway ENV
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin", adminRoutes);

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});

// ---------------- CRON: SEND ALERTS ----------------
cron.schedule("0 */6 * * *", async () => {
  console.log("🔁 Cron: running sendAlertsToAllUsers");
  try {
    await sendAlertsToAllUsers(null);
    console.log("🔔 Cron: alerts done");
  } catch (err) {
    console.error("Cron alert error:", err);
  }
});

// ---------------- CRON: FETCH JOBS ----------------
cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("🚀 Scheduled fetch started...");

    const BASE_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

    await fetch(`${BASE_URL}/api/jobs/fetch`, { method: "POST" });

    console.log("✅ Scheduled fetch completed");
  } catch (err) {
    console.error("❌ Scheduled fetch failed:", err);
  }
});
