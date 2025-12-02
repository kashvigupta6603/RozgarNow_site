import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";

import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import preferenceRoutes from "./routes/preferenceRoutes";
import alertRoutes from "./routes/alertRoutes";
import adminRoutes from "./routes/adminRoutes";

import cron from "node-cron";
import fetch from "node-fetch";

import { sendAlertsToAllUsers } from "./controllers/notificationController";

const app = express();

// ✅ Correct CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ⏳ Cron job
cron.schedule("0 */6 * * *", async () => {
  try {
    await fetch(
      `${process.env.SERVER_URL}/api/jobs/fetch`,
      { method: "POST" }
    );
    console.log("Cron fetch done");
  } catch (err) {
    console.log("Cron failed", err);
  }
});
