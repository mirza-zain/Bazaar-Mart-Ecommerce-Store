import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import ScreenCategory from "./ScreenCategory";
import SupportBanner from "./SupportBanner";
import FeaturedItems from "./FeaturedItems";
import BottomBanner from "./BottomBanner";

export default function HomePage() {
  const editorialCollections = [
    {
      title: "Oversized Graphic Tees",
      subtitle: "Vintage Washed Silhouette",
      href: "/products?category=Clothing&subCategory=T-Shirt",
      image: "/images/img1.jpg",
      tag: "Signature Drop",
    },
    {
      title: "Relaxed Sets & Trackwear",
      subtitle: "Everyday Streetwear Silhouettes",
      href: "/products?category=Clothing",
      image: "/images/img2.jpg",
      tag: "Streetwear",
    },
    {
      title: "Luxury Jewelry Sets",
      subtitle: "Necklaces, Earrings & Crystal Sets",
      href: "/products?category=Jewelry",
      image: "/images/img3.jpg",
      tag: "Fine Jewelry",
    },
    {
      title: "Chains & Accessories",
      subtitle: "Silver Chains, Rings & Watches",
      href: "/products?category=Accessories",
      image: "/images/img4.jpg",
      tag: "Accessories",
    },
  ];

  return (
    <>
      {/* High-Fashion Editorial Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-5 md:px-12 pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
        {/* Hero Top Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-100 rounded-full text-xs font-semibold tracking-wider uppercase text-neutral-800 border border-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Est. 2020 • Signature Collection</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-neutral-900 leading-[0.95]">
            Redefining <br className="hidden sm:inline" />
            <span className="text-neutral-500 font-normal">Modern </span>
            Streetwear
          </h1>

          {/* Hero Subtitle */}
          <p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
            Engineered heavyweight hoodies, graphic silhouettes, and statement jewelry crafted for effortless confidence across Pakistan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold text-sm sm:text-base rounded-2xl hover:bg-neutral-800 transition shadow-sm cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=Clothing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 text-neutral-900 font-semibold text-sm sm:text-base rounded-2xl hover:bg-neutral-200 transition cursor-pointer"
            >
              <span>Shop Hoodies & Tees</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-neutral-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-black shrink-0" />
              <span>Free Delivery Over PKR 8,000</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
              <span>Cash on Delivery in Karachi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-black shrink-0" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Editorial 4-Card Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 sm:mt-16">
          {editorialCollections.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className="group relative aspect-3/4 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs block"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                priority={idx < 2}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Tag Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-black text-[11px] font-bold uppercase rounded-lg shadow-xs">
                  {col.tag}
                </span>
              </div>

              {/* Card Footer Content */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                <div>
                  <h3 className="text-white text-lg font-bold leading-tight group-hover:underline">
                    {col.title}
                  </h3>
                  <p className="text-neutral-300 text-xs mt-0.5">{col.subtitle}</p>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sleek Marquee Brand Ticker */}
      <div className="w-full bg-black text-white py-3.5 overflow-hidden border-y border-neutral-800">
        <div className="flex w-max animate-scroll-left gap-8 text-xs sm:text-sm font-bold uppercase tracking-widest">
          <div className="flex items-center gap-8 shrink-0">
            <span>Karachi Express Shipping</span>
            <span>•</span>
            <span>Premium Heavyweight Cottons</span>
            <span>•</span>
            <span>Free Delivery Over PKR 8,000</span>
            <span>•</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>New Drops Every Friday</span>
            <span>•</span>
            <span>Handcrafted Urban Jewelry</span>
            <span>•</span>
          </div>
          <div className="flex items-center gap-8 shrink-0">
            <span>Karachi Express Shipping</span>
            <span>•</span>
            <span>Premium Heavyweight Cottons</span>
            <span>•</span>
            <span>Free Delivery Over PKR 8,000</span>
            <span>•</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>New Drops Every Friday</span>
            <span>•</span>
            <span>Handcrafted Urban Jewelry</span>
            <span>•</span>
          </div>
        </div>
      </div>

      <ScreenCategory />
      <FeaturedItems />
      <SupportBanner />
      <BottomBanner />
    </>
  );
}
