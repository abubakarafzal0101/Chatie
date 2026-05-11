import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cloudinary from "./config/cloudinary.js";
const app = express();

// connection database
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.log("DB connection error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chatie-chat.vercel.app"],
  }),
);

// routes
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// listining server
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
}

export default app;
