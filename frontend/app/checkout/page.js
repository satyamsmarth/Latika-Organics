"use client";

import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Checkout() {

  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector(state => state.cart.items || []);

  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState(""); // ✅ NEW
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* AUTH CHECK + PREFILL EMAIL */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.email) {
      setEmail(storedUser.email);
    }

  }, []);

  /* EMAIL VALIDATION */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /* LOAD RAZORPAY */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNow = async () => {

    if (!address || !city || !pincode) {
      toast.error("Please fill delivery address");
      return;
    }

    if (email && !isValidEmail(email)) {
      toast.error("Enter valid email");
      return;
    }

    const razorLoaded = await loadRazorpay();

    if (!razorLoaded) {
      toast.error("Payment system failed to load");
      return;
    }

    try {

      const loadingToast = toast.loading("Creating order...");

      const res = await fetch(
        "https://latika-organics-backend.onrender.com/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems })
        }
      );

      const data = await res.json();

      toast.dismiss(loadingToast);

      const storedUser = JSON.parse(localStorage.getItem("user"));

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        name: "Latika Organics",

        handler: async function (response) {

          const verifyToast = toast.loading("Verifying payment...");

          const verify = await fetch(
            "https://latika-organics-backend.onrender.com/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  userId: storedUser.phone,
                  phone: storedUser.phone,
                  email, // ✅ IMPORTANT
                  items: cartItems,
                  total: data.total,
                  address: { address, city, pincode }
                }
              })
            }
          );

          const result = await verify.json();

          toast.dismiss(verifyToast);

          if (result.success) {
            toast.success("Payment Successful 🎉");
            dispatch(clearCart());
            router.push("/order-success");
          } else {
            toast.error("Payment failed ❌");
          }
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      toast.error("Something went wrong");
    }

  };

  if (!mounted) return null;

  return (

    <div className="max-w-6xl mx-auto px-6 py-10 fade-in">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* ✅ EMAIL SECTION */}
          <div className="bg-white p-6 rounded-xl shadow border card-hover">

            <h2 className="text-xl font-semibold mb-4">
              Contact Details
            </h2>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-md"
            />

          </div>

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-xl shadow border card-hover">

            <h2 className="text-xl font-semibold mb-4">
              Delivery Address
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-3 rounded-md"
              />

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border p-3 rounded-md"
                />

                <input
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border p-3 rounded-md"
                />

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow border h-fit sticky top-24 card-hover">

          <h2 className="text-xl font-semibold mb-5">
            Order Summary
          </h2>

          <div className="space-y-3 mb-4">

            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={payNow}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Pay Now
          </button>

        </div>

      </div>

    </div>

  );

}