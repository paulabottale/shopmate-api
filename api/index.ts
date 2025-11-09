// api/index.ts
import app from "../src/app";
import { connectDB } from "../src/config/connectDB";

let dbInit: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!dbInit) {
      dbInit = connectDB();
    }
    await dbInit;

    return app(req, res);
  } catch (err: any) {
    console.error("Serverless handler error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err?.message || "unknown" });
  }
}


