import mongoose from "mongoose";

mongoose.set("bufferCommands", false); // 🔥 VERY IMPORTANT FOR VERCEL

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log("♻️ Mongo already connected (cached)");
        return mongoose.connection;   // 👈 ADD THIS
    }

    try {
        console.log("⏳ Connecting to Mongo...");

        const db = await mongoose.connect(
            process.env.MONGO_URI ||
            "mongodb+srv://tech16:Rahul%231819@cluster0.ovgz62a.mongodb.net/SECOUNDBRAIN",
            {
                serverSelectionTimeoutMS: 10000,
                maxPoolSize: 5,
            }
        );

        isConnected = db.connection.readyState === 1;
        console.log("✅ MongoDB connected successfully!");
        return db.connection;   // 👈 ADD THIS
    } catch (error: any) {
        console.error("❌ MongoDB Connection Error:", error.message);
        throw error;
    }
};

