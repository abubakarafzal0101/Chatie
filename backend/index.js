import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
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

// routes
app.get("/", (req, res) => {
  res.send("hello world");
});
// listining server
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
}

export default app;
