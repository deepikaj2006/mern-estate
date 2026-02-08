import express from "express";
import {
  createListing,
  handleListingImagesUpload,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadListingImages } from "../utils/multer.js";

const router = express.Router();

/* ===============================
   Upload listing images (SAFE)
   =============================== */
router.post(
  "/upload-images",
  verifyToken,
  (req, res, next) => {
    uploadListingImages.array("images", 6)(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  handleListingImagesUpload
);

/* ===============================
   Create listing
   =============================== */
router.post("/create", verifyToken, createListing);

export default router;
