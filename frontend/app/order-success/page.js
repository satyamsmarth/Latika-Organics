"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccess() {

  const router = useRouter();

  /* AUTO REDIRECT (OPTIONAL) */
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 fade-in">

      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">

        {/* ✅ ANIMATION */}
        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">

            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>

          </div>

        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        {/* BUTTONS */}
        <div className="space-y-3">

          <button
            onClick={() => router.push("/profile")}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            View Orders
          </button>

          <button
            onClick={() => router.push("/products")}
            className="w-full border py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Continue Shopping
          </button>

        </div>

        {/* AUTO REDIRECT TEXT */}
        <p className="text-xs text-gray-400 mt-6">
          Redirecting to your orders...
        </p>

      </div>

    </div>

  );

}