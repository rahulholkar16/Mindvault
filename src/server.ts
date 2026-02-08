import app from "./app.js";
import { connectDB } from "./config/db.js";

export default async function handler(req, res) {
    try {
        await connectDB(); // ensure DB is connected
        return app(req, res);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: err.message,
        });
    }
}