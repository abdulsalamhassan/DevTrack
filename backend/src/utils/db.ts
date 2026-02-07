import mongoose from "mongoose";

export async function connectDB(uri: string) {
    try {
        const conn = await mongoose.connect(uri);
        const dbName = conn?.connection?.name || mongoose.connection?.name || "<unknown>";
        console.log(`MongoDB connected: ${dbName}`);
        return conn;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}
