import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import jwt from "jsonwebtoken";

export const protect: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const request = req as AuthenticatedRequest;
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
      role: string;
    };
    request.user = decoded;
    console.log("Decoded JWT:", decoded);

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const request = req as AuthenticatedRequest;
  if (request.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};
