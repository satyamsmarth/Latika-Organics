"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState("All");

  /* LOAD PRODUCTS */
  useEffect(() => {
    fetch("https://latika-organics-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  let filteredProducts = [...products];

  /* CATEGORY FILTER */
  if (category !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === category
    );
  }

  /* PRICE FILTER */
  if (priceRange !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= Number(priceRange)
    );
  }

  /* SORT */
  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (

    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* 🔥 PREMIUM HEADER */}
        <div className="mb-10 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm">

          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Explore Organic Oils
          </h1>

          <p className="text-gray-500 mt-2 max-w-lg">
            Discover pure, cold-pressed and natural oils for cooking, hair and wellness.
          </p>

          <p className="text-sm text-gray-400 mt-3">
            Showing {filteredProducts.length} products
          </p>

        </div>


        {/* 🔥 FILTERS CARD */}
        <div className="mb-8 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">

          <ProductFilters
            setCategory={setCategory}
            setSort={setSort}
            setPriceRange={setPriceRange}
          />

        </div>


        {/* 🔥 PRODUCT GRID WRAPPER */}
        {filteredProducts.length > 0 ? (

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>

          </div>

        ) : (

          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">

            <div className="text-5xl mb-4">🛒</div>

            <h2 className="text-xl font-semibold text-gray-700">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try adjusting filters or check back later.
            </p>

          </div>

        )}

      </div>

    </div>

  );

}