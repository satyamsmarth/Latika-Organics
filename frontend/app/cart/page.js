"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart
} from "../../store/cartSlice";

import Link from "next/link";

export default function Cart() {

  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* EMPTY CART */

  if (cartItems.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Your cart is empty 🛒
        </h2>

        <Link href="/products">
          <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* ================= ITEMS ================= */}

        <div className="md:col-span-2 space-y-5">

          {cartItems.map((item) => (

            <div
              key={item.id}
              className="flex gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >

              {/* IMAGE (SAFE FALLBACK) */}
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded">

                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="h-full object-contain"
                />

              </div>

              {/* DETAILS */}
              <div className="flex-1 flex flex-col">

                <h3 className="font-semibold text-lg text-gray-800">
                  {item.name}
                </h3>

                <p className="text-green-600 font-semibold">
                  ₹{item.price}
                </p>

                {/* CONTROLS */}
                <div className="flex items-center justify-between mt-auto pt-4">

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3">

                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>

                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>

                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="bg-white border rounded-xl p-6 shadow-sm h-fit sticky top-24">

          <h2 className="text-xl font-semibold mb-5">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between mb-4 text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Link href="/checkout">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
              Proceed to Checkout
            </button>
          </Link>

        </div>

      </div>

    </div>

  );

}