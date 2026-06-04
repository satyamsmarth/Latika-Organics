"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const router = useRouter();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetch("https://latika-organics-backend.onrender.com/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrderCount(data.count || 0);
      });

    const socket = io("https://latika-organics-backend.onrender.com");

    socket.on("new-order", () => {
      alert("🛒 New Order Received!");
      setOrderCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h2 className="text-2xl font-bold text-red-500">
              {orderCount}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Revenue</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹ -- 
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Products</p>
            <h2 className="text-2xl font-bold text-gray-800">
              --
            </h2>
          </div>

        </div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          <Link href="/admin/products">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold mb-2">Manage Products</h3>
              <p className="text-sm text-gray-500">
                Add, edit or delete products
              </p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer relative">
              <h3 className="font-semibold mb-2">Manage Orders</h3>
              <p className="text-sm text-gray-500">
                View and update orders
              </p>

              {orderCount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {orderCount}
                </span>
              )}
            </div>
          </Link>

          <Link href="/admin/add-product">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold mb-2">Add Product</h3>
              <p className="text-sm text-gray-500">
                Create new product
              </p>
            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}