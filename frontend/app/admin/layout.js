"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {

  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Add Product", path: "/admin/add-product", icon: "➕" },
    { name: "Products", path: "/admin/products", icon: "📦" },

    // ✅ ADDED CATEGORY
    { name: "Categories", path: "/admin/categories", icon: "🏷️" },
    { name: "Quantities", path: "/admin/quantities", icon: "📏" },

    { name: "Orders", path: "/admin/orders", icon: "🧾" },
    { name: "Live Orders", path: "/admin/live-orders", icon: "⚡" },
     { name: "Manage Operators", path: "/admin/operators", icon: "👥" },
  ];

  return (

    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px",
        background: "rgba(17,17,17,0.95)",
        color: "#fff",
        padding: "24px 18px",
        position: "fixed",
        top: "70px",
        bottom: 0
      }}>

        <h2 style={{ marginBottom: "30px" }}>
          ⚙️ Admin Panel
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          {menu.map((item) => {

            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#bbb",
                  background: isActive
                    ? "linear-gradient(135deg,#2e7d32,#43a047)"
                    : "transparent",
                  fontWeight: isActive ? "600" : "400"
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}

        </div>

      </div>

      {/* MAIN */}
      <div style={{
        marginLeft: "260px",
        padding: "30px",
        marginTop: "70px",
        width: "100%"
      }}>

        <div style={{
          background: "#fff",
          padding: "18px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}>
          <h1>Admin Dashboard</h1>
        </div>

        {children}

      </div>

    </div>

  );
}