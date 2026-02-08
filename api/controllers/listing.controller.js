import Listing from "../models/listing.model.js";

/* ===============================
   Handle uploaded listing images
   =============================== */
export const handleListingImagesUpload = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map((file) => file.path);

    return res.status(200).json({
      success: true,
      urls: imageUrls,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   Create new listing
   =============================== */
export const createListing = async (req, res, next) => {
  try {
    if (!req.body.imageUrls || req.body.imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,
    });

    return res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};
