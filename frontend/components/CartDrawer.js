"use client";

import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart } from "../store/cartSlice";
import Link from "next/link";

export default function CartDrawer({ open, setOpen }) {

 const dispatch = useDispatch();

 const cartItems = useSelector(state => state.cart?.items || []);

 const total = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
 );

 if(!open) return null;

 return (

  <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto">

   {/* CLOSE BUTTON */}

   <button
    onClick={() => setOpen(false)}
    className="mb-4 text-gray-500"
   >
    Close ✕
   </button>

   <h2 className="text-xl font-semibold mb-6">
    Your Cart
   </h2>

   {cartItems.length === 0 && (
    <p className="text-gray-500">Cart is empty</p>
   )}

   {cartItems.map(item => (

    <div key={item.id} className="mb-6 border-b pb-4">

     <p className="font-medium">{item.name}</p>

     <p className="text-green-600">₹{item.price}</p>

     <div className="flex items-center gap-3 mt-2">

      <button
       onClick={()=>dispatch(decreaseQty(item.id))}
       className="bg-gray-200 px-2 rounded"
      >
       -
      </button>

      <span>{item.quantity}</span>

      <button
       onClick={()=>dispatch(increaseQty(item.id))}
       className="bg-gray-200 px-2 rounded"
      >
       +
      </button>

      <button
       onClick={()=>dispatch(removeFromCart(item.id))}
       className="text-red-500"
      >
       🗑
      </button>

     </div>

    </div>

   ))}

   {cartItems.length > 0 && (

    <div className="mt-8">

     <p className="font-semibold mb-4">
      Total: ₹{total}
     </p>

     <Link href="/checkout">

      <button
       onClick={()=>setOpen(false)}
       className="w-full bg-black text-white py-2 rounded"
      >
       Checkout
      </button>

     </Link>

    </div>

   )}

  </div>

 );
}