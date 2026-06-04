"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await fetch("https://latika-organics-backend.onrender.com/api/orders");
        const orderData = await orderRes.json();

        const productRes = await fetch("https://latika-organics-backend.onrender.com/api/products");
        const productData = await productRes.json();

        setOrders(orderData.orders || []);
        setProducts(productData || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  /* ================= CALCULATIONS ================= */

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const avgOrder =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  /* ================= CHART DATA ================= */

  const chartData = orders.slice(0, 7).map((o, i) => ({
    name: `#${i + 1}`,
    total: o.total
  }));

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <StatCard title="Revenue" value={`₹${totalRevenue}`} gradient="from-green-500 to-green-700" />
          <StatCard title="Orders" value={totalOrders} gradient="from-blue-500 to-blue-700" />
          <StatCard title="Products" value={totalProducts} gradient="from-orange-400 to-orange-600" />
          <StatCard title="Avg Order" value={`₹${avgOrder}`} gradient="from-purple-500 to-purple-700" />

        </div>

        {/* CHART (RECHARTS + PREMIUM UI) */}
        <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-lg">

          <h2 className="text-lg font-semibold mb-6 text-gray-700">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}


/* ================= PREMIUM STAT CARD ================= */

function StatCard({ title, value, gradient }) {

  return (

    <div className={`rounded-2xl p-5 text-white shadow-lg 
      bg-gradient-to-br ${gradient} 
      transition-all duration-300 hover:scale-105 hover:shadow-xl`}>

      <p className="text-sm opacity-80">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

    </div>

  );

}