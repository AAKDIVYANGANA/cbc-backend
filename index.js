import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug logger
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

async function startServer() {
    try {
        console.log("Trying to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

        // Routes
        app.use("/api/user", userRouter);
        app.use("/api/product", productRouter);

        app.listen(process.env.PORT || 3000, () => {
            console.log("🚀 Server running on port", process.env.PORT || 3000);
        });
    } catch (error) {
        console.error("❌ MongoDB CONNECTION ERROR:", error);
        process.exit(1);
    }
}

startServer();