import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./config/db.js";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    console.log("🔥 HANDLER STARTED");

    try {
        await connectDB();   // 🔥 PEHLE DB CONNECT

        // 👇 IMPORT APP *AFTER* DB CONNECT (CRUCIAL)
        const app = (await import("./app.js")).default;

        return app(req, res);
    } catch (err: any) {
        console.error("❌ DB ERROR:", err.message);
        return res.status(500).json({ message: "Database connection failed" });
    }
}
