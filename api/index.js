import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

// ======================
// APP CONFIG
// ======================
const app = express();

// ======================
// MIDDLEWARE (ORDER MATTERS)
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true, // allow cookies
  })
);

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ======================
// DATABASE
// ======================
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });

// ======================
// SERVER
// ======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
