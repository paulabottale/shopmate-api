import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(token, env.accessSecret) as { sub: string; role: string };
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
  const user = (_req as any).user as { role: string } | undefined;
  if (user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
  next();
}
