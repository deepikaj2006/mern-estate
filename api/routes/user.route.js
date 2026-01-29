import express from "express";
import { test } from "../controllers/user.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/test", test);

// ✅ FIXED Cloudinary upload route (with proper Multer error handling)
router.post("/upload-avatar", (req, res) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("MULTER ERROR:", err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("FILE:", req.file);

    return res.status(200).json({
      success: true,
      avatar: req.file.path, // Cloudinary URL
    });
  });
});

export default router;
