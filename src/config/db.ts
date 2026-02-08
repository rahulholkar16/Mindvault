import mongoose from "mongoose";

let isConneted: boolean = false;

export const connectDB = async () => {
    console.log("Mongo_URL: ", process.env.DB_URL!);
    
    if (isConneted) return;
    try {
        const db = await mongoose.connect(process.env.DB_URL!, {
            serverSelectionTimeoutMS: 30000,
        });
        isConneted = db.connection.readyState === 1;
        console.log("✅ MongoDB connected");
    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ MongoDB error:", error.message);
        } else {
            console.error("❌ MongoDB error:", error);
        }
        process.exit(1);
    }
};
