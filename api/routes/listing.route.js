import express from "express";
import {
  createListing,
  handleListingImagesUpload,
  deleteListing,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadListingImages } from "../utils/multer.js";

const router = express.Router();

/* ===============================
   Upload listing images (FIXED)
   =============================== */
router.post(
  "/upload-images",
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
   Create listing (PROTECTED)
   =============================== */
router.post("/create", verifyToken, createListing);
router.delete("/delete/:id",verifyToken,deleteListing);
router.post("/update/:id",verifyToken,updateListing);

export default router;
