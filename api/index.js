import dotenv from "dotenv";
dotenv.config();
import path from "path";

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config({ path: path.resolve("./api/.env") });
//dotenv.config();
console.log("ENV TEST:", process.env.CLOUDINARY_CLOUD_NAME);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
//app.use("/api/user", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
