"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetch("https://latika-organics-backend.onrender.com/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {

    if (!confirm("Delete this product?")) return;

    await fetch(`https://latika-organics-backend.onrender.com/api/products/${id}`, {
      method: "DELETE"
    });

    loadProducts();

  };

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Products
            </h1>
            <p className="text-sm text-gray-500">
              {products.length} products
            </p>
          </div>

          <Link
            href="/admin/add-product"
            className="bg-green-600 text-white px-4 py-2 rounded-lg 
            hover:bg-green-700 transition shadow-sm"
          >
            + Add Product
          </Link>

        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">

              <tr>
                <th className="text-left p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>

            </thead>

            <tbody>

              {products.length > 0 ? (

                products.map(product => (

                  <tr
                    key={product._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* PRODUCT */}
                    <td className="p-4 flex items-center gap-4">

                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/80"
                        }
                        className="w-14 h-14 object-cover rounded-lg"
                      />

                      <div>
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID: {product._id.slice(-6)}
                        </p>
                      </div>

                    </td>

                    {/* PRICE */}
                    <td className="text-center font-medium">
                      ₹{product.price || product.variants?.[0]?.price}
                    </td>

                    {/* STOCK */}
                    <td className="text-center">
                      {product.stock || product.variants?.[0]?.stock || "-"}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-center">

                      <div className="flex justify-center gap-2">

                        <Link
                          href={`/admin/edit-product/${product._id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="4" className="text-center p-10 text-gray-500">
                    No products found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}