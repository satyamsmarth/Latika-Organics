"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= EMAIL VALIDATION ================= */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {

    if (!phone) {
      toast.error("Enter phone number");
      return;
    }

    if (email && !isValidEmail(email)) {
      toast.error("Enter valid email");
      return;
    }

    try {

      setLoading(true);

      const t = toast.loading("Sending OTP...");

    const res = await fetch("https://latika-organics-backend.onrender.com/api/auth/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone,
    email
  })
});

      let data = {};
      try { data = await res.json(); } catch {}

      toast.dismiss(t);

      if (!res.ok) {
        toast.error(data?.message || "Failed to send OTP");
        return;
      }

      toast.success("OTP sent 📩");

      setStep(2);
      setTimer(30);
      setOtp(Array(6).fill(""));

      setTimeout(() => inputsRef.current[0]?.focus(), 100);

    } catch (err) {
      console.log(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {

      setLoading(true);

      const t = toast.loading("Verifying...");

      const res = await fetch("https://latika-organics-backend.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp: otpValue,
          name,
          email
        })
      });

      let data = {};
      try { data = await res.json(); } catch {}

      toast.dismiss(t);

      if (!res.ok) {
        console.log("OTP ERROR:", data);
        toast.error(data?.message || "Invalid or expired OTP");
        return;
      }

      /* SUCCESS */
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Welcome 🎉");

      router.push("/");

    } catch (err) {
      console.log(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP HANDLERS ================= */
  const handleChange = (value, index) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {

    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const arr = paste.split("");
    const filled = [...Array(6)].map((_, i) => arr[i] || "");

    setOtp(filled);

    filled.forEach((v, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = v;
      }
    });
  };

  /* ================= UI ================= */
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl border border-gray-100 rounded-2xl p-8"
      >

        <h1 className="text-xl font-semibold text-center mb-6">
          {step === 1 ? "Login / Signup" : "Enter OTP"}
        </h1>

        <AnimatePresence mode="wait">

          {step === 1 && (

            <motion.div key="step1" className="space-y-4">

              <input
                placeholder="Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="input"
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="input"
              />

              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                className="input"
              />

              <button
                onClick={sendOtp}
                disabled={loading}
                className="btn"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

            </motion.div>
          )}

          {step === 2 && (

            <motion.div key="step2" className="space-y-6 text-center">

              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((val, i) => (
                  <input
                    key={i}
                    ref={(el)=>inputsRef.current[i]=el}
                    value={val}
                    onChange={(e)=>handleChange(e.target.value, i)}
                    onKeyDown={(e)=>handleKeyDown(e, i)}
                    maxLength={1}
                    className="otp-box"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="btn"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                disabled={timer > 0}
                onClick={sendOtp}
                className="text-sm text-gray-500"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>

            </motion.div>
          )}

        </AnimatePresence>

      </motion.div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          outline: none;
        }

        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: black;
          color: white;
        }

        .otp-box {
          width: 45px;
          height: 50px;
          text-align: center;
          font-size: 18px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .otp-box:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
          outline: none;
        }
      `}</style>

    </div>
  );
}