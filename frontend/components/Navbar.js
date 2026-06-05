"use client";

import SearchBar from "./SearchBar";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const dropdownRef = useRef();

  const loadUser = () => {
    try {
      const u = localStorage.getItem("user");
      const r = localStorage.getItem("role");

      setUser(u ? JSON.parse(u) : null);
      setRole(r || null);
    } catch {
      setUser(null);
      setRole(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadUser();
  }, []);

  useEffect(() => {
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener(
      "userUpdated",
      handleUserUpdate
    );

    return () =>
      window.removeEventListener(
        "userUpdated",
        handleUserUpdate
      );
  }, []);

  useEffect(() => {
    loadUser();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "click",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "click",
        handleClick
      );
  }, []);

  const handleLogout = () => {
    localStorage.clear();

    window.dispatchEvent(
      new Event("userUpdated")
    );

    router.push("/");
  };

  const isActive = (path) =>
    pathname === path;

  if (!mounted) return null;

  return (
    <>
      {/* TOP BAR */}

      <div className="fixed top-0 left-0 right-0 z-[1001] bg-green-800 text-white text-center text-xs md:text-sm py-2 font-medium">
        🌿 Free Shipping Above ₹999 • 100% Organic • Cold Pressed Oils
      </div>

      {/* NAVBAR */}

      <nav
        className="
          fixed
          top-[32px]
          left-0
          right-0
          z-[1000]
          backdrop-blur-xl
          bg-white/90
          border-b
          border-gray-100
          shadow-sm
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            md:px-6
            h-[72px]
            flex
            items-center
            justify-between
            gap-4
          "
        >
          {/* LOGO */}

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              shrink-0
            "
          >
            <img
              src="/logo.png"
              alt="Latika Organics"
              className="h-10 w-auto"
            />

            <div>
              <div
                className="
                  font-bold
                  text-green-700
                  text-lg
                "
              >
                Latika Organics
              </div>

              <div
                className="
                  text-[11px]
                  text-gray-500
                "
              >
                Pure • Natural • Organic
              </div>
            </div>
          </Link>

          {/* DESKTOP SEARCH */}

          <div
            className="
              hidden
              md:flex
              flex-1
              justify-center
              px-4
            "
          >
            <SearchBar />
          </div>

          {/* DESKTOP MENU */}

          <div
            className="
              hidden
              md:flex
              items-center
              gap-6
              shrink-0
            "
          >
            <Link
              href="/"
              className={`transition ${
                isActive("/")
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={`transition ${
                isActive("/products")
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              Products
            </Link>

            {user && (
              <Link
                href="/wishlist"
                className={`transition ${
                  isActive("/wishlist")
                    ? "text-green-700 font-semibold"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                Wishlist
              </Link>
            )}

            {user && (
              <Link
                href="/cart"
                className="
                  relative
                  text-gray-700
                  hover:text-green-700
                "
              >
                🛒 Cart

                {cartItems.length > 0 && (
                  <span
                    className="
                      absolute
                      -top-2
                      -right-4
                      bg-green-600
                      text-white
                      text-[10px]
                      px-1.5
                      py-0.5
                      rounded-full
                    "
                  >
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                className="
                  text-green-700
                  font-semibold
                "
              >
                Admin
              </Link>
            )}

            {!user ? (
              <Link href="/login">
                <button
                  className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-5
                    py-2
                    rounded-xl
                    font-medium
                    transition
                  "
                >
                  Login
                </button>
              </Link>
            ) : (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() =>
                    setDropdownOpen(
                      !dropdownOpen
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    bg-gray-100
                    px-4
                    py-2
                    rounded-xl
                    hover:bg-gray-200
                    transition
                  "
                >
                  👤
                  <span>
                    {user.name || "User"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-2
                      w-48
                      bg-white
                      rounded-2xl
                      shadow-xl
                      border
                      border-gray-100
                      overflow-hidden
                    "
                  >
                    <Link href="/profile">
                      <div className="px-4 py-3 hover:bg-gray-50">
                        My Profile
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        text-red-500
                        hover:bg-red-50
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}

          <button
            className="
              md:hidden
              text-2xl
            "
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}

        {mobileOpen && (
          <div
            className="
              md:hidden
              border-t
              bg-white
              px-4
              py-4
              space-y-4
              shadow-lg
            "
          >
            {/* MOBILE SEARCH */}

            <SearchBar />

            <Link
              href="/"
              className={`block ${
                isActive("/")
                  ? "text-green-700 font-semibold"
                  : ""
              }`}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={`block ${
                isActive("/products")
                  ? "text-green-700 font-semibold"
                  : ""
              }`}
            >
              Products
            </Link>

            {user && (
              <Link
                href="/wishlist"
                className={`block ${
                  isActive("/wishlist")
                    ? "text-green-700 font-semibold"
                    : ""
                }`}
              >
                Wishlist
              </Link>
            )}

            {user && (
              <Link
                href="/cart"
                className={`block ${
                  isActive("/cart")
                    ? "text-green-700 font-semibold"
                    : ""
                }`}
              >
                🛒 Cart ({cartItems.length})
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                className="block text-green-700 font-semibold"
              >
                Admin Dashboard
              </Link>
            )}

            {!user ? (
              <Link href="/login">
                <button
                  className="
                    w-full
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    py-3
                    rounded-xl
                    font-medium
                  "
                >
                  Login
                </button>
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block"
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    text-red-500
                    font-medium
                  "
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}