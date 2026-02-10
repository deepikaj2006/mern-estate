import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  /* =====================================================
     IMAGE UPLOAD (ONLY CHANGE → CLOUDINARY)
     ===================================================== */
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      try {
        setUploading(true);
        setImageUploadError(false);

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append("images", files[i]);
        }

        const res = await fetch("/api/listing/upload-images", {
          method: "POST",
          body: data,
          credentials: "include",
        });

        const result = await res.json();

        if (!result.success) {
          setImageUploadError(result.message);
          setUploading(false);
          return;
        }

        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(result.urls),
        });

        setUploading(false);
      } catch (err) {
        setImageUploadError("Image upload failed (2MB max per image)");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  /* =====================================================
     REMOVE IMAGE (UNCHANGED)
     ===================================================== */
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  /* =====================================================
     HANDLE CHANGE (SAME AS YOUTUBER)
     ===================================================== */
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  /* =====================================================
     SUBMIT LISTING (SAME FLOW)
     ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      if (+formData.discountPrice >= +formData.regularPrice && formData.offer)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      // ✅ SAME REDIRECT BEHAVIOR
      navigate(`/listing/${data.listing._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* =====================================================
     UI (UNCHANGED)
     ===================================================== */
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
            id="name"
            placeholder="Name"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            id="description"
            placeholder="Description"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            {["sale", "rent", "parking", "furnished", "offer"].map((id) => (
              <label key={id} className="flex gap-2">
                <input
                  type="checkbox"
                  id={id}
                  checked={formData[id] || formData.type === id}
                  onChange={handleChange}
                />
                <span>{id}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
 
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

 <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>

             {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  <span className='text-xs'>($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            className="p-3 border rounded-lg"
            onChange={(e) => setFiles(e.target.files)}
          />

          <button
            type="button"
            onClick={handleImageSubmit}
            disabled={uploading}
            className="p-3 border border-green-700 text-green-700 rounded-lg"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}

          {formData.imageUrls.map((url, i) => (
            <div key={url} className="flex justify-between border p-3">
              <img src={url} className="w-20 h-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="text-red-700"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>

          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
