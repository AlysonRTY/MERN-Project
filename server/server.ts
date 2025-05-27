import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cloudinaryConfig from "./config/cloudinaryConfiguration";
import userRouter from "./routes/user";
import duckRouter from "./routes/ducks";
import commentRouter from "./routes/comments";

dotenv.config();

// Initialize Cloudinary first
cloudinaryConfig();

const DBConnection = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MongoDB connection string");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Connection to MongoDB established");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

(async () => {
  await DBConnection();
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Routes
  app.use("/api/ducks", duckRouter);
  app.use("/api/user", userRouter);
  app.use("/api/comments", commentRouter);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
