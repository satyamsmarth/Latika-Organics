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

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const itemInCart = cartItems.find(
    (item) => item.id === product._id
  );

  const quantity = itemInCart
    ? itemInCart.quantity
    : 0;

  const imageUrl =
    product?.images?.[0] ||
    product?.image ||
    "https://via.placeholder.com/300?text=No+Image";

  return (

    <div
      className="
        group
        bg-white
        rounded-3xl
        border
        border-gray-100
        overflow-hidden
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border-green-200
      "
    >

      {/* IMAGE */}

      <div
        className="
          relative
          h-64
          bg-gradient-to-b
          from-green-50
          to-white
          flex
          items-center
          justify-center
          p-6
          overflow-hidden
        "
      >

        {/* ORGANIC BADGE */}

        <div
          className="
            absolute
            top-4
            left-4
            bg-green-600
            text-white
            text-xs
            font-medium
            px-3
            py-1
            rounded-full
            shadow
          "
        >
          🌿 Organic
        </div>

        {/* IMAGE */}

        <img
          src={imageUrl}
          alt={product.name}
          className="
            h-full
            object-contain
            transition-all
            duration-700
            group-hover:scale-110
          "
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300?text=No+Image";
          }}
        />

      </div>

      {/* CONTENT */}

      <div className="p-5 flex flex-col flex-1">

        {/* PRODUCT NAME */}

        <h3
          className="
            font-semibold
            text-gray-900
            text-lg
            leading-snug
            line-clamp-2
            min-h-[56px]
          "
        >
          {product.name}
        </h3>

        {/* RATING */}

        <div
          className="
            flex
            items-center
            gap-1
            mt-2
            text-sm
          "
        >
          <span className="text-yellow-500">
            ⭐⭐⭐⭐⭐
          </span>

          <span className="text-gray-500">
            (4.9)
          </span>
        </div>

        {/* PRICE */}

        <div className="mt-4">

          <p
            className="
              text-2xl
              font-bold
              text-green-700
            "
          >
            ₹{product.price}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Premium Cold-Pressed Oil
          </p>

        </div>

        <div className="mt-auto">

          {/* CART CONTROLS */}

          {quantity > 0 ? (

            <div className="mt-5">

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    bg-gray-100
                    px-2
                    py-2
                    rounded-xl
                  "
                >

                  <button
                    onClick={() =>
                      dispatch(
                        decreaseQty(product._id)
                      )
                    }
                    className="
                      w-8
                      h-8
                      rounded-lg
                      hover:bg-white
                      transition
                      font-bold
                    "
                  >
                    −
                  </button>

                  <span
                    className="
                      w-8
                      text-center
                      font-semibold
                    "
                  >
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        increaseQty(product._id)
                      )
                    }
                    className="
                      w-8
                      h-8
                      rounded-lg
                      hover:bg-white
                      transition
                      font-bold
                    "
                  >
                    +
                  </button>

                </div>

                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart(product._id)
                    )
                  }
                  className="
                    text-red-500
                    hover:text-red-600
                    text-sm
                    font-medium
                    transition
                  "
                >
                  Remove
                </button>

              </div>

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
              className="
                mt-5
                w-full
                bg-gradient-to-r
                from-green-600
                to-green-700
                text-white
                py-3
                rounded-xl
                font-semibold
                shadow-md
                hover:shadow-xl
                hover:from-green-700
                hover:to-green-800
                transition-all
                duration-300
              "
            >
              Add to Cart
            </button>

          )}

          {/* VIEW PRODUCT */}

          <Link href={`/product/${product._id}`}>

            <button
              className="
                mt-3
                w-full
                border
                border-gray-200
                py-3
                rounded-xl
                hover:bg-gray-50
                font-medium
                transition
              "
            >
              View Product
            </button>

          </Link>

        </div>

      </div>

    </div>

  );

}