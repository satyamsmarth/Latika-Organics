"use client";

import Link from "next/link";

export default function HeroSection() {

const banner =
"https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1800";

return (

```
<section className="relative overflow-hidden rounded-3xl">

  <div className="relative h-[520px] md:h-[620px]">

    <img
      src={banner}
      alt="Latika Organics"
      className="
        absolute inset-0
        w-full h-full
        object-cover
        scale-105
        transition-transform
        duration-[12000ms]
        hover:scale-110
      "
    />

    <div
      className="
        absolute inset-0
        bg-gradient-to-r
        from-black/80
        via-black/55
        to-black/20
      "
    />

    <div className="absolute left-0 top-0 w-full h-full">

      <div className="absolute left-20 top-20 w-72 h-72 bg-green-500/20 blur-[120px]" />

      <div className="absolute right-20 bottom-20 w-60 h-60 bg-green-300/10 blur-[120px]" />

    </div>

    <div className="relative z-10 h-full max-w-7xl mx-auto px-6">

      <div className="h-full flex items-center">

        <div className="max-w-3xl">

          <div
            className="
              inline-flex items-center
              gap-2
              bg-green-500/20
              border border-green-400/30
              text-green-200
              px-4 py-2
              rounded-full
              text-sm
              mb-6
            "
          >
            🌿 100% Natural Wellness
          </div>

          <h1
            className="
              text-5xl
              md:text-7xl
              font-bold
              text-white
              leading-tight
            "
          >
            Experience
            <span className="text-green-400">
              {" "}Pure Organic{" "}
            </span>
            Wellness
          </h1>

          <p
            className="
              mt-6
              text-lg
              md:text-2xl
              text-gray-200
              max-w-2xl
              leading-relaxed
            "
          >
            Premium cold-pressed oils crafted with purity,
            tradition and wellness in every drop.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">

            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              🌱 Chemical Free
            </span>

            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              🧪 Lab Tested
            </span>

            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              🚚 Fast Delivery
            </span>

          </div>

          <div className="flex gap-4 mt-10">

            <Link href="/products">

              <button
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-8 py-4
                  rounded-xl
                  font-semibold
                  shadow-xl
                  transition
                "
              >
                Shop Now
              </button>

            </Link>

            <Link href="/products">

              <button
                className="
                  bg-white/10
                  backdrop-blur
                  border
                  border-white/20
                  text-white
                  px-8 py-4
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                Explore Collection
              </button>

            </Link>

          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 max-w-xl">

            <div>
              <div className="text-3xl font-bold text-white">
                100%
              </div>
              <div className="text-gray-300 text-sm">
                Natural
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-white">
                500+
              </div>
              <div className="text-gray-300 text-sm">
                Happy Customers
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-white">
                4.9★
              </div>
              <div className="text-gray-300 text-sm">
                Average Rating
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>
```

);

}
