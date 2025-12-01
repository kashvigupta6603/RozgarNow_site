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

// 🤝 PRODUCTION CORS WITH FRONTEND URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin", adminRoutes);

// 🔔 Alert Cron
cron.schedule("0 */6 * * *", async () => {
  console.log("🔁 Cron: running sendAlertsToAllUsers");
  try {
    await sendAlertsToAllUsers(null);
    console.log("🔔 Cron: alerts done");
  } catch (err) {
    console.error("Cron alert error:", err);
  }
});

// Root
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// 🚀 Start Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});

// ⏳ Cron Fetch Jobs Every 6 Hours
cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("🚀 Scheduled fetch: starting");

    await fetch(
      `${process.env.SERVER_URL || `http://localhost:${PORT}`}/api/jobs/fetch`,
      { method: "POST" }
    );

    console.log("✅ Scheduled fetch: done");
  } catch (err) {
    console.error("Scheduled fetch failed:", err);
  }
});
