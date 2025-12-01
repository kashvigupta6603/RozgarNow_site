import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * Save or update user preferences.
 */
export const savePreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Ensure user is authenticated
    if (typeof userId !== "number") {
      return res.status(401).json({ message: "User not authenticated or ID missing" });
    }

    // Extract fields from request body
    const { age, qualification, category, location, keywords, experience, govt } = req.body;

    // Create or update preference
    const pref = await prisma.preference.upsert({
      where: { userId },
      update: {
        age,
        qualification,
        category,
        location,
        keywords,
        experience,
        govt,
      },
      create: {
        userId,
        age,
        qualification,
        category,
        location,
        keywords,
        experience,
        govt,
      },
    });

    return res.json({ success: true, pref });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return res.status(500).json({ message: "Failed to save preferences" });
  }
};

/**
 * Get user preferences.
 */
export const getPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (typeof userId !== "number") {
      return res.status(401).json({ message: "User not authenticated or ID missing" });
    }

    const pref = await prisma.preference.findUnique({
      where: { userId },
    });

    return res.json({ success: true, pref });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({ message: "Failed to fetch preferences" });
  }
};
