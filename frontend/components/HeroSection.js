"use client";

import Link from "next/link";

export default function HeroSection() {

  const banner =
    "https://images.unsplash.com/photo-1608571423539-e951a1f2b2f1?q=80&w=1200";

  return (

    <div className="relative w-full h-[350px] rounded-xl overflow-hidden">

      {/* BACKGROUND IMAGE (SAFE PREMIUM MOTION) */}
      <img
        src={banner}
        alt="Organic Oils"
        className="w-full h-full object-cover scale-105 transition-transform duration-[8000ms] hover:scale-110"
      />

      {/* PREMIUM OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex items-center">

        {/* SOFT LIGHT GLOW */}
        <div className="absolute left-10 top-10 w-72 h-72 bg-green-400/20 blur-[120px] opacity-60" />

        <div className="max-w-6xl mx-auto px-6 text-white relative z-10">

          {/* TAGLINE */}
          <p className="text-sm md:text-base text-green-300 mb-2 tracking-widest uppercase opacity-90">
            🌿 100% Natural Wellness
          </p>

          {/* HEADING */}
          <h1 className="text-3xl md:text-5xl font-semibold mb-4 leading-tight tracking-tight">
            Pure Organic Oils
          </h1>

          {/* SUBTEXT */}
          <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-md">
            Cold Pressed • Natural • Chemical Free
          </p>

          {/* CTA */}
          <Link href="/products">
            <button
              className="bg-green-600 px-6 py-3 rounded-lg 
              hover:bg-green-700 
              transition-all duration-200 
              shadow-lg hover:shadow-2xl 
              active:scale-95"
            >
              Shop Now
            </button>
          </Link>

        </div>

      </div>

    </div>

  );

}