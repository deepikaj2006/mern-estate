import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser 
} from "../controllers/user.controller.js";
import { uploadAvatar } from "../utils/multer.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id",verifyToken,getUserListings)
router.get('/:id',verifyToken,getUser)

/* ===============================
   Upload avatar (Cloudinary)
   =============================== */
router.post("/upload-avatar", verifyToken, (req, res) => {
  uploadAvatar.single("avatar")(req, res, (err) => {
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

    return res.status(200).json({
      success: true,
      avatar: req.file.path, // Cloudinary URL
    });
  });
});

export default router;
