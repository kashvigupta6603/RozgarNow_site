
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
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Route setup
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/admin", adminRoutes);



// schedule: every 6 hours at minute 0
cron.schedule("0 */6 * * *", async () => {
  console.log("🔁 Cron: running sendAlertsToAllUsers");
  try {
    await sendAlertsToAllUsers(null);
    console.log("🔔 Cron: alerts done");
  } catch (err) {
    console.error("Cron alert error:", err);
  }
});


// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// ✅ Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

// ✅ Scheduled job: auto-fetch new data every 6 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("🚀 Scheduled fetch: starting");
    await fetch(
      `${process.env.SERVER_URL || "http://localhost:4000"}/api/jobs/fetch`,
      { method: "POST" }
    );
    console.log("✅ Scheduled fetch: done");
  } catch (err) {
    console.error("Scheduled fetch failed:", err);
  }
});
