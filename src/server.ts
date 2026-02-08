import app from "./app.js";
import { connectDB } from "./config/db.js";

connectDB()
    .then(() => {
        console.log("✅ Mongo Connected");
        
        app.listen(3000, () => {
            console.log("🚀 Server running");
        });
    })
    .catch((err) => {
        console.error("❌ DB connection failed", err);
    });
