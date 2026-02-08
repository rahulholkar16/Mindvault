import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "./app.js";
import { connectDB } from "./config/db.js";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    try {
        await connectDB();
        return app(req, res);
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: err?.message || "Unknown error",
        });
    }
}
