import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    imageUrls: [],
  });

  /* ===============================
     IMAGE UPLOAD (CLOUDINARY)
     =============================== */
  const handleImageSubmit = async () => {
    if (files.length === 0) return;

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }

    const data = new FormData();
    files.forEach((file) => data.append("images", file));

    try {
      setUploading(true);
      setImageUploadError(false);

      const res = await fetch("/api/listing/upload-images", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();

      if (!result.success) {
        setImageUploadError(result.message || "Image upload failed");
        setUploading(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(result.urls),
      }));

      setUploading(false);
    } catch (error) {
      setImageUploadError("Image upload failed (max 2MB per image)");
      setUploading(false);
    }
  };

  /* ===============================
     REMOVE IMAGE
     =============================== */
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  /* ===============================
     INPUT HANDLER
     =============================== */
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  /* ===============================
     CREATE LISTING
     =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.offer &&
      Number(formData.discountPrice) >= Number(formData.regularPrice)
    ) {
      alert("Discount price must be lower than regular price");
      return;
    }

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        console.log(data.message);
        return;
      }

      navigate(`/listing/${data.listing._id}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <textarea
            placeholder="Description"
            id="description"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Address"
            id="address"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          {/* TYPE */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                checked={formData.type === "sale"}
                onChange={() => setFormData({ ...formData, type: "sale" })}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                checked={formData.type === "rent"}
                onChange={() => setFormData({ ...formData, type: "rent" })}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking" onChange={handleChange} />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" onChange={handleChange} />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" onChange={handleChange} />
              <span>Offer</span>
            </div>
          </div>

          {/* BEDS / BATHS / PRICE */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                required
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                  className="p-3 border rounded-lg"
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              className="p-3 border rounded w-full"
              onChange={(e) => setFiles([...e.target.files])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}

          {formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between items-center border p-3"
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
            </div>
          ))}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
