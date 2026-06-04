"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";

export default function ProductDetail() {

  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://latika-organics-backend.onrender.com/api/products/${id}`);
        const data = await res.json();

        setProduct(data);

        if (data?.images?.length > 0) {
          setSelectedImage(data.images[0]);
        }

        if (data?.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Not found</div>;

  const imageUrl =
    selectedImage ||
    product?.images?.[0] ||
    product?.image ||
    "https://via.placeholder.com/400";

  const displayPrice =
    selectedVariant?.price || product.price;

  return (

    <div className="bg-gray-50 min-h-screen py-10">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-10">

          {/* ================= LEFT: IMAGE SECTION ================= */}
          <div className="bg-white p-6 rounded-2xl shadow-md">

            <div className="h-[360px] flex items-center justify-center">
              <img
                src={imageUrl}
                className="max-h-full object-contain transition hover:scale-105"
              />
            </div>

            <div className="flex gap-3 mt-4">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 rounded-lg cursor-pointer border ${
                    selectedImage === img
                      ? "border-green-600"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>

          </div>


          {/* ================= RIGHT: BUY PANEL ================= */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">

            <h1 className="text-3xl font-bold mb-3">
              {product.name}
            </h1>

            <p className="text-green-700 text-3xl font-bold mb-4">
              ₹{displayPrice}
            </p>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* VARIANTS */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Select Quantity</p>

                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v) => (
                    <button
                      key={v.label}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedVariant?.label === v.label
                          ? "bg-green-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADD TO CART */}
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product._id,
                    name: product.name,
                    price: displayPrice,
                    quantityLabel: selectedVariant?.label
                  })
                )
              }
              className="bg-green-600 text-white py-3 rounded-xl text-lg font-semibold 
              hover:bg-green-700 transition shadow-md hover:shadow-lg active:scale-95 mb-5"
            >
              Add to Cart
            </button>

            {/* TRUST BOX */}
            <div className="bg-gray-50 border rounded-xl p-4 text-sm space-y-2">
              <p>✔ 100% Natural</p>
              <p>✔ Cold Pressed</p>
              <p>✔ No Chemicals</p>
              <p>✔ Fast Delivery</p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}