"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(
          "https://latika-organics-backend.onrender.com/api/products"
        );

        const data = await res.json();

        const productList =
          data?.products ||
          data ||
          [];

        setProducts(
          Array.isArray(productList)
            ? productList
            : []
        );
      } catch (err) {
        console.log("Search load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= SEARCH ================= */

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const searchTerm =
      query.toLowerCase().trim();

    const filtered = products
      .filter((p) => {
        const name =
          p.name?.toLowerCase() || "";

        const category =
          p.category?.toLowerCase() || "";

        const description =
          p.description?.toLowerCase() || "";

        return (
          name.includes(searchTerm) ||
          category.includes(searchTerm) ||
          description.includes(searchTerm)
        );
      })
      .sort((a, b) => {
        const aStarts =
          a.name
            ?.toLowerCase()
            .startsWith(searchTerm);

        const bStarts =
          b.name
            ?.toLowerCase()
            .startsWith(searchTerm);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return 0;
      });

    setResults(filtered.slice(0, 6));
    setActiveIndex(-1);
  }, [query, products]);

  /* ================= KEYBOARD ================= */

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setActiveIndex((prev) =>
        Math.min(
          prev + 1,
          results.length - 1
        )
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setActiveIndex((prev) =>
        Math.max(prev - 1, 0)
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        router.push(
          `/product/${results[activeIndex]._id}`
        );
      } else {
        router.push(
          `/products?search=${encodeURIComponent(
            query
          )}`
        );
      }

      setQuery("");
      setResults([]);
    }
  };

  const handleSelect = (product) => {
    router.push(`/product/${product._id}`);

    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* INPUT */}

      <div className="relative">
        <span
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        >
          🔍
        </span>

        <input
          type="text"
          placeholder="Search organic oils..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onFocus={() =>
            setFocused(true)
          }
          onBlur={() =>
            setTimeout(
              () => setFocused(false),
              200
            )
          }
          onKeyDown={handleKeyDown}
          className="
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            pl-11
            pr-4
            py-3
            outline-none
            transition
            shadow-sm
            focus:border-green-500
            focus:ring-2
            focus:ring-green-100
          "
        />
      </div>

      {/* DROPDOWN */}

      {focused && query && (
        <div
          className="
            absolute
            top-full
            left-0
            right-0
            mt-2
            bg-white
            border
            border-gray-100
            rounded-2xl
            shadow-xl
            overflow-hidden
            z-[9999]
          "
        >
          {loading ? (
            <div className="p-4 text-sm text-gray-500">
              Loading products...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map(
                (product, index) => (
                  <div
                    key={product._id}
                    onClick={() =>
                      handleSelect(
                        product
                      )
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      cursor-pointer
                      transition
                      border-b
                      border-gray-50
                      last:border-b-0
                      ${
                        activeIndex ===
                        index
                          ? "bg-green-50"
                          : "hover:bg-green-50"
                      }
                    `}
                  >
                    <img
                      src={
                        product.images?.[0] ||
                        product.image ||
                        "https://via.placeholder.com/50"
                      }
                      alt={
                        product.name
                      }
                      className="
                        w-10
                        h-10
                        rounded-lg
                        object-cover
                        border
                      "
                    />

                    <div className="flex-1">
                      <div
                        className="
                          text-sm
                          font-medium
                          text-gray-800
                        "
                      >
                        {product.name}
                      </div>

                      <div
                        className="
                          text-xs
                          text-green-700
                          font-semibold
                        "
                      >
                        ₹
                        {product.price}
                      </div>
                    </div>
                  </div>
                )
              )}

              <button
                onClick={() =>
                  router.push(
                    `/products?search=${encodeURIComponent(
                      query
                    )}`
                  )
                }
                className="
                  w-full
                  text-center
                  py-3
                  text-sm
                  font-medium
                  text-green-700
                  hover:bg-green-50
                "
              >
                View all results →
              </button>
            </>
          ) : (
            <div
              className="
                p-5
                text-center
                text-sm
                text-gray-500
              "
            >
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}