import express from "express";
import { savePreferences, getPreferences } from "../controllers/preferenceController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/set", authMiddleware, savePreferences);
router.get("/get", authMiddleware, getPreferences);

export default router;
