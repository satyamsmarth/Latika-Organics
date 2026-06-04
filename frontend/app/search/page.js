"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("https://latika-organics-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query, products]);

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {results.length === 0 && <p>No products found</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {results.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg"
          >
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
            )}

            <h3 className="mt-2 font-semibold">
              {product.name}
            </h3>

            <p className="text-green-600">
              ₹{product.price}
            </p>

            <Link href={`/product/${product._id}`}>
              <button className="mt-2 bg-black text-white px-4 py-2 rounded">
                View
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}