import mongoose from "mongoose";
let isConnected = false;
export async function connectDB(uri) {
    if (isConnected) {
        return;
    }
    const start = Date.now();
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8080,
    });
    isConnected = true;
    console.log(`MongoDB connected (singleton) in ${Date.now() - start}ms`);
}
