"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/utils/socket";
import toast from "react-hot-toast";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [newOrderIds, setNewOrderIds] = useState([]);
  const audioRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    try {
      const res = await fetch("https://latika-organics-backend.onrender.com/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    fetchOrders();

    const socket = getSocket();

    const handleNewOrder = async (data) => {

      if (!data?.orderId) return;

      let attempts = 0;
      let newOrder = null;

      while (attempts < 5 && !newOrder) {
        const res = await fetch("https://latika-organics-backend.onrender.com/api/orders");
        const result = await res.json();

        const allOrders = Array.isArray(result)
          ? result
          : result.orders || [];

        newOrder = allOrders.find(o => o._id === data.orderId);

        if (!newOrder) {
          await new Promise(r => setTimeout(r, 500));
          attempts++;
        }
      }

      if (!newOrder) return;

      toast.success(`🛒 New Order #${newOrder._id.slice(-6)}`, {
        duration: 6000
      });

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      setOrders(prev => {
        const exists = prev.find(o => o._id === newOrder._id);
        if (exists) return prev;
        return [newOrder, ...prev];
      });

      setNewOrderIds(prev => [...prev, newOrder._id]);
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };

  }, []);

  /* ================= STATUS STYLE ================= */
  const getStatusStyle = (status) => {
    if (status === "Processing") return "bg-yellow-100 text-yellow-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    if (status === "Delivered") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    await fetch(
      `https://latika-organics-backend.onrender.com/api/orders/update-status/${orderId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      }
    );

    setOrders(prev =>
      prev.map(o =>
        o._id === orderId ? { ...o, status } : o
      )
    );
  };

  /* ================= ACKNOWLEDGE ================= */
  const acknowledgeOrder = (id) => {
    setNewOrderIds(prev => prev.filter(o => o !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="max-w-6xl mx-auto space-y-4">

        <h1 className="text-2xl font-semibold tracking-tight">
          Orders
        </h1>

        {orders.map(order => {

          const isOpen = expanded === order._id;
          const isNew = newOrderIds.includes(order._id);

          return (

            <motion.div
              key={order._id}
              layout
              whileHover={{ scale: 1.005 }}
              className={`
                rounded-2xl border bg-white shadow-sm transition-all
                ${isNew ? "ring-2 ring-yellow-300" : ""}
              `}
            >

              {/* HEADER */}
              <div
                onClick={() => {
                  setExpanded(isOpen ? null : order._id);
                  acknowledgeOrder(order._id);
                }}
                className="grid grid-cols-5 px-5 py-4 items-center cursor-pointer"
              >

                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    #{order._id.slice(-6)}
                  </span>

                  {isNew && (
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></span>
                  )}
                </div>

                <span className="text-gray-700">
                  {order.name || "Guest"}
                </span>

                <span className="font-medium">
                  ₹{order.total}
                </span>

                <span>
                  <span className={`px-2 py-1 text-xs rounded ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </span>

                <span className="text-right text-gray-400">
                  {isOpen ? "▲" : "▼"}
                </span>

              </div>

              {/* EXPAND */}
              <AnimatePresence>
                {isOpen && (

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-5 pb-5 border-t"
                  >

                    {/* CUSTOMER */}
                    <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                      <div><b>Name:</b> {order.name}</div>
                      <div><b>Email:</b> {order.email}</div>
                      <div><b>Phone:</b> {order.phone}</div>
                    </div>

                    {/* ADDRESS */}
                    <div className="mt-3 text-sm text-gray-700">
                      <b>Address:</b>{" "}
                      {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                    </div>

                    {/* ITEMS */}
                    <div className="mt-4">
                      <b className="text-sm">Items</b>
                      <div className="mt-2 space-y-1 text-sm">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* STATUS BUTTONS */}
                    <div className="mt-5 flex gap-2 flex-wrap">
                      {["Processing","Shipped","Delivered"].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order._id, s)}
                          className="px-3 py-1 text-xs border rounded-md hover:bg-gray-100 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                  </motion.div>

                )}
              </AnimatePresence>

            </motion.div>

          );

        })}

      </div>
    </div>
  );
}