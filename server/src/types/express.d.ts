import { User } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: Partial<User>;   
  }
}

// src/types/express.d.ts

// This file extends the Express Request interface
declare namespace Express {
  export interface Request {
    // Define the structure of the 'user' object added by your middleware
    user?: {
      id: number; // Assuming your user ID is always a number
      // Add other properties if your middleware adds them (e.g., email: string)
    };
  }
}