"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* 🔥 GLOBAL SYNC */
const updateUserGlobally = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("userUpdated"));
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://latika-organics-backend.onrender.com/api/users/${storedUser._id}`
        );

        const data = await res.json();

        setUser(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
        });

        updateUserGlobally(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://latika-organics-backend.onrender.com/api/orders/${storedUser.phone}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchOrders();
  }, []);

  const saveProfile = async () => {
    try {
      const res = await fetch(
        `https://latika-organics-backend.onrender.com/api/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      setUser(data);
      updateUserGlobally(data);
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderTimeline = (status) => {
    const currentIndex = steps.indexOf(status);

    return (
      <div className="flex items-center justify-between mt-6">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 text-center relative">
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-3 left-1/2 w-full h-[2px] ${
                  index < currentIndex ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}

            <div
              className={`w-6 h-6 mx-auto rounded-full ${
                index <= currentIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            />

            <p className="text-[11px] mt-2 text-gray-500">{step}</p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-10 space-y-4">
        <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-40 bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          My Profile
        </h1>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center text-xl font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.name || "No Name"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email || "No email"}
                  </p>
                </div>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-80"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveProfile}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {["name", "email"].map((field) => (
                <div key={field}>
                  <p className="text-xs text-gray-400 uppercase mb-1">
                    {field}
                  </p>

                  {editing ? (
                    <input
                      value={form[field]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field]: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {user[field] || "Not provided"}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">
                  Phone
                </p>

                <p className="text-gray-800">{user.phone}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">
                  Role
                </p>

                <span className="px-2 py-1 text-xs rounded bg-gray-100">
                  {user.role}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ENHANCED ORDERS SECTION */}

        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">ORDER ID</p>

                      <p className="font-medium text-gray-800 break-all">
                        {order._id}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <a
                        href={`https://latika-organics-backend.onrender.com/api/orders/invoice/${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        Download Invoice
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold mb-4">Products</h3>

                  <div className="space-y-3">
                    {(order.items || []).length > 0 ? (
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border rounded-xl p-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="font-semibold">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        Product details unavailable
                      </p>
                    )}
                  </div>

                  {renderTimeline(order.status)}

                  <div className="grid md:grid-cols-2 gap-5 mt-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold mb-2">
                        Delivery Address
                      </h4>

                      <p className="text-gray-600 text-sm leading-6">
                        {order.address?.street || "N/A"}
                        <br />

                        {order.address?.city || ""}
                        {order.address?.state
                          ? `, ${order.address.state}`
                          : ""}

                        <br />

                        {order.address?.pincode || ""}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold mb-2">
                        Order Summary
                      </h4>

                      <div className="flex justify-between">
                        <span>Total Amount</span>

                        <span className="font-bold text-green-700 text-lg">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}