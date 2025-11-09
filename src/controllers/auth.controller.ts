import type { Request, Response } from "express";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { registerSchema } from "../schemas/auth.schema";
import { env } from "../config/env";


type AnyPayload = string | Buffer | object;

function signAccess(payload: AnyPayload) {
  return jwt.sign(payload, env.accessSecret as Secret, { expiresIn: env.accessTtl });
}

function signRefresh(payload: AnyPayload) {
  return jwt.sign(payload, env.refreshSecret as Secret, { expiresIn: env.refreshTtl });
}


export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { email, password } = parsed.data;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccess({ sub: user.id, role: user.role });
  const refreshToken = signRefresh({ sub: user.id });
  res.json({ accessToken, refreshToken });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: "Missing refreshToken" });
  try {
    const payload = jwt.verify(refreshToken, env.refreshSecret) as { sub: string };
    const accessToken = signAccess({ sub: payload.sub, role: "USER" });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
}
