"use client";

import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await fetch("https://latika-organics-backend.onrender.com/api/products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }

      } catch (err) {
        console.log("Product fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);

  return (

    <div className="space-y-12 fade-in">

      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ================= BEST SELLING ================= */}
      <section className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold mb-2">
            Best Selling Oils
          </h2>

          <p className="text-gray-500">
            Pure, natural & cold-pressed oils loved by customers
          </p>

        </div>

        {/* ================= LOADING (ENHANCED) ================= */}
        {loading ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {Array(4).fill(0).map((_, i) => (

              <div
                key={i}
                className="bg-white rounded-xl border shadow-sm p-4"
              >
                {/* IMAGE */}
                <div className="h-40 skeleton mb-4 rounded"></div>

                {/* TITLE */}
                <div className="h-4 skeleton w-3/4 mb-2"></div>

                {/* PRICE */}
                <div className="h-4 skeleton w-1/2 mb-4"></div>

                {/* BUTTON */}
                <div className="h-8 skeleton rounded"></div>
              </div>

            ))}

          </div>

        ) : products.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No products available
          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {products.slice(0, 4).map((product) => (

              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3"
              >
                <ProductCard product={product} />
              </div>

            ))}

          </div>

        )}

      </section>

      {/* ================= CTA ================= */}
      <section className="bg-green-50 py-12">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-2xl font-semibold mb-4">
            Switch to Healthy Living 🌿
          </h2>

          <p className="text-gray-600 mb-6">
            Experience the purity of organic oils made with love and care.
          </p>

          <a
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Explore Products
          </a>

        </div>

      </section>

    </div>

  );

}