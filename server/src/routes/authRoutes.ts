import { Router } from "express";
import { register, login } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import prisma from "../prisma";

const router = Router();

// signup / login
router.post("/register", register);
router.post("/login", login);

// ✅ CURRENT LOGGED-IN USER DETAIL
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // authMiddleware ne token se user id nikaal ke req.user me daali hogi
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isAdmin: true, // <--- ADDED: Include admin status
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin, // <--- ADDED: Return admin status
    });
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;