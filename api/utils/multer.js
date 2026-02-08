import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

/* =====================================================
   Avatar Upload (Profile Image)
   ===================================================== */
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

/* =====================================================
   Listing Images Upload (Multiple)
   ===================================================== */
const listingStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export const uploadListingImages = multer({
  storage: listingStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
