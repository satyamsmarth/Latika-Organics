"use client";

import { useState, useEffect } from "react";

export default function AddProduct() {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [variants, setVariants] = useState([]);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetch("https://latika-organics-backend.onrender.com/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data || []));

    fetch("https://latika-organics-backend.onrender.com/api/quantities")
      .then(res => res.json())
      .then(data => setQuantities(data || []));
  }, []);

  const handleImages = (files) => {
    const fileArray = Array.from(files);

    setImages(prev => [...prev, ...fileArray]);

    const previewArray = fileArray.map(file =>
      URL.createObjectURL(file)
    );

    setPreviews(prev => [...prev, ...previewArray]);
  };

  const removeImage = (index) => {
    const newImgs = [...images];
    const newPrev = [...previews];

    newImgs.splice(index, 1);
    newPrev.splice(index, 1);

    setImages(newImgs);
    setPreviews(newPrev);
  };

  const addVariant = (label) => {
    if (variants.find(v => v.label === label)) return;
    setVariants([...variants, { label, price: "", stock: "" }]);
  };

  const updateVariant = (i, field, val) => {
    const updated = [...variants];
    updated[i][field] = val;
    setVariants(updated);
  };

  const removeVariant = (label) => {
    setVariants(variants.filter(v => v.label !== label));
  };

  const addProduct = async () => {

    if (!name || !category) return alert("Fill required fields");
    if (variants.length === 0) return alert("Add variants");

    let uploadedUrls = [];

    for (let img of images) {

      const fd = new FormData();
      fd.append("file", img);
      fd.append("upload_preset", "ecommerce_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dizwzwsww/image/upload",
        { method: "POST", body: fd }
      );

      const data = await res.json();
      uploadedUrls.push(data.secure_url);

    }

    await fetch("https://latika-organics-backend.onrender.com/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        variants,
        images: uploadedUrls
      })
    });

    alert("Product Added");

    setName("");
    setCategory("");
    setVariants([]);
    setImages([]);
    setPreviews([]);

  };

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-4xl mx-auto space-y-8">

        <h1 className="text-3xl font-semibold text-gray-800">
          Add Product
        </h1>

        {/* IMAGE SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow border">

          <p className="font-medium mb-4">Product Images</p>

          {/* DROP ZONE */}
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">

            <span className="text-gray-500 text-sm">
              Click or drag images to upload
            </span>

            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleImages(e.target.files)}
            />

          </label>

          {/* PREVIEW */}
          <div className="grid grid-cols-4 gap-4 mt-4">

            {previews.map((src, i) => (

              <div key={i} className="relative group">

                <img
                  src={src}
                  className="w-full h-24 object-cover rounded-lg"
                />

                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* PRODUCT INFO */}
        <div className="bg-white p-6 rounded-2xl shadow border space-y-4">

          <p className="font-medium">Product Info</p>

          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Category</option>

            {categories.map(c => (
              <option key={c._id}>{c.name}</option>
            ))}

          </select>

        </div>

        {/* VARIANTS */}
        <div className="bg-white p-6 rounded-2xl shadow border">

          <p className="font-medium mb-3">Variants</p>

          <div className="flex gap-2 flex-wrap mb-4">

            {quantities.map(q => (
              <button
                key={q._id}
                onClick={() => addVariant(q.label)}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100"
              >
                {q.label}
              </button>
            ))}

          </div>

          <div className="space-y-3">

            {variants.map((v, i) => (

              <div key={v.label} className="p-4 border rounded-xl bg-gray-50">

                <div className="flex justify-between mb-2">
                  <strong>{v.label}</strong>

                  <button
                    onClick={() => removeVariant(v.label)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <input
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(i, "price", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) =>
                      updateVariant(i, "stock", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* SUBMIT */}
        <button
          onClick={addProduct}
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg 
          hover:bg-green-700 transition shadow-md hover:shadow-lg"
        >
          Add Product
        </button>

      </div>

    </div>

  );

}