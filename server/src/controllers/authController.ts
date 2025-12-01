import type { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered",
      user,
      token: generateToken(user.id)
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Invalid password" });

    return res.status(200).json({
      message: "Login successful",
      user,
      token: generateToken(user.id)
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
