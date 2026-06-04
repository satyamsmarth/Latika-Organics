"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart
} from "../store/cartSlice";

import Link from "next/link";

export default function ProductCard({ product }) {

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart?.items || []);

  const itemInCart = cartItems.find(
    (item) => item.id === product._id
  );

  const quantity = itemInCart ? itemInCart.quantity : 0;

  /* CLOUDINARY SAFE IMAGE */
  const imageUrl =
    product?.images?.[0] ||
    product?.image ||
    "https://via.placeholder.com/300?text=No+Image";

  return (

    <div className="bg-white rounded-xl border border-gray-100 
      shadow-sm flex flex-col overflow-hidden 
      transition-all duration-300 
      hover:shadow-xl hover:-translate-y-1 card-hover fade-in">

      {/* IMAGE */}
      <div className="h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">

        <img
          src={imageUrl}
          alt={product.name}
          className="h-full object-contain 
          transition-all duration-500 
          hover:scale-110"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />

      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">

        {/* NAME */}
        <h3 className="font-medium text-gray-800 text-[15px] line-clamp-2 min-h-[42px]">
          {product.name}
        </h3>

        {/* PRICE */}
        <p className="text-green-700 font-semibold text-lg mt-1">
          ₹{product.price}
        </p>

        <div className="mt-auto">

          {/* ================= CART CONTROLS ================= */}

          {quantity > 0 ? (

            <div className="flex items-center justify-between mt-4">

              <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">

                <button
                  onClick={() => dispatch(decreaseQty(product._id))}
                  className="w-7 h-7 flex items-center justify-center rounded 
                  hover:bg-gray-200 transition active:scale-90"
                >
                  -
                </button>

                <span className="w-6 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() => dispatch(increaseQty(product._id))}
                  className="w-7 h-7 flex items-center justify-center rounded 
                  hover:bg-gray-200 transition active:scale-90"
                >
                  +
                </button>

              </div>

              <button
                onClick={() => dispatch(removeFromCart(product._id))}
                className="text-red-500 hover:text-red-600 text-sm transition"
              >
                Remove
              </button>

            </div>

          ) : (

            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product._id,
                    name: product.name,
                    price: product.price
                  })
                )
              }
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg 
              hover:bg-green-700 transition-all duration-200 
              shadow-sm hover:shadow-md active:scale-95 font-medium"
            >
              Add to Cart
            </button>

          )}

          {/* ================= VIEW BUTTON ================= */}

          <Link href={`/product/${product._id}`}>
            <button className="mt-3 w-full border border-gray-200 py-2 rounded-lg 
              hover:bg-gray-50 transition text-sm">
              View Product
            </button>
          </Link>

        </div>

      </div>

    </div>

  );

}