"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {

  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useSelector((state) => state.cart.items || []);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const dropdownRef = useRef();
  const searchRef = useRef();

  /* ================= LOAD USER ================= */
  const loadUser = () => {
    try {
      const u = localStorage.getItem("user");
      const r = localStorage.getItem("role");

      setUser(u ? JSON.parse(u) : null);
      setRole(r || null);
    } catch (err) {
      setUser(null);
      setRole(null);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    setMounted(true);
    loadUser();
  }, []);

  /* ================= 🔥 GLOBAL SYNC ================= */
  useEffect(() => {

    const handleUserUpdate = () => {
      console.log("🔄 Navbar sync triggered");
      loadUser();
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };

  }, []);

  /* ================= ROUTE CHANGE ================= */
  useEffect(() => {
    loadUser();
  }, [pathname]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();

    // 🔥 trigger global update
    window.dispatchEvent(new Event("userUpdated"));

    router.push("/");
  };

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`https://latika-organics-backend.onrender.com/api/products?search=${search}`);
        const data = await res.json();
        const list = data.products || data || [];
        setResults(list);
        setShowResults(true);
        setActiveIndex(-1);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const handleKeyDown = (e) => {
    if (!showResults) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        router.push(`/product/${results[activeIndex]._id}`);
      } else {
        router.push(`/products?search=${search}`);
      }
      setShowResults(false);
    }
  };

  const highlight = (text) => {
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase()
        ? <span key={i} style={{ fontWeight: 600, color: "#2e7d32" }}>{part}</span>
        : part
    );
  };

  if (!mounted) return null;

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 1000,
      backdropFilter: "blur(14px)",
      background: "rgba(255,255,255,0.88)",
      borderBottom: "1px solid rgba(0,0,0,0.04)"
    }}>

      <div style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "20px"
      }}>

        {/* LOGO */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "38px" }} />
          <span style={{ fontWeight: 600, fontSize: "15px", color: "#2e7d32" }}>
            Latika Organics
          </span>
        </Link>

        {/* SEARCH */}
        <div ref={searchRef} style={{ flex: 1, maxWidth: "520px", position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search && setShowResults(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #e5e5e5",
              outline: "none"
            }}
          />
        </div>

        {/* MENU */}
        <div style={{ display: "flex", gap: "18px", marginLeft: "auto", alignItems: "center" }}>

          <Link href="/products">Products</Link>

          {user && <Link href="/wishlist">Wishlist</Link>}
          {user && <Link href="/cart">Cart ({cartItems.length})</Link>}

          {role === "admin" && (
            <Link href="/admin" style={{ color: "#2e7d32", fontWeight: 600 }}>
              Admin
            </Link>
          )}

          {!user ? (
            <Link href="/login">
              <button style={{
                background: "#2e7d32",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none"
              }}>
                Login
              </button>
            </Link>
          ) : (
            <div ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                👤 {user.name || "User"}
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                }}>
                  <Link href="/profile"><div style={{ padding: "10px" }}>Profile</div></Link>
                  <div onClick={handleLogout} style={{ padding: "10px", color: "red" }}>Logout</div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </nav>
  );
}