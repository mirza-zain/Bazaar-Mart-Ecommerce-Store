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
      title: "Smart Gadgets & Tech",
      subtitle: "Rechargeable Tools & Modern Tech",
      href: "/products?category=Accessories",
      image: "/images/img1.jpg",
      tag: "Trending Tech",
    },
    {
      title: "Home & Kitchen Utility",
      subtitle: "Clever Organizers & Daily Tools",
      href: "/products?category=Accessories",
      image: "/images/img2.jpg",
      tag: "Home Utility",
    },
    {
      title: "Toys, Fun & Learning",
      subtitle: "Novelty Gifts & Family Play",
      href: "/products",
      image: "/images/img3.jpg",
      tag: "Kids & Family",
    },
    {
      title: "Daily Problem Solvers",
      subtitle: "Personal Care, Safety & Lifehacks",
      href: "/products",
      image: "/images/img4.jpg",
      tag: "Best Sellers",
    },
  ];

  return (
    <>
      {/* Modern Lifestyle & Gadgets Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-5 md:px-12 pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
        {/* Hero Top Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-100 rounded-full text-xs font-semibold tracking-wider uppercase text-neutral-800 border border-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Est. 2020 • Trending Gadgets & Utility Mart</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-neutral-900 leading-[0.95]">
            Smart Living <br className="hidden sm:inline" />
            <span className="text-neutral-500 font-normal">& Daily </span>
            Essentials
          </h1>

          {/* Hero Subtitle */}
          <p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
            Discover clever smart gadgets, home & kitchen utility, innovative toys, and everyday problem-solving essentials crafted for effortless convenience across Pakistan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold text-sm sm:text-base rounded-2xl hover:bg-neutral-800 transition shadow-sm cursor-pointer"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=Accessories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 text-neutral-900 font-semibold text-sm sm:text-base rounded-2xl hover:bg-neutral-200 transition cursor-pointer"
            >
              <span>Trending Gadgets & Tools</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-neutral-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-black shrink-0" />
              <span>Nationwide Express Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-black shrink-0" />
              <span>7-Day Replacement Guarantee</span>
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
            <span>Nationwide Express Delivery</span>
            <span>•</span>
            <span>Cash on Delivery Across Pakistan</span>
            <span>•</span>
            <span>Smart Living & Tech Innovations</span>
            <span>•</span>
            <span>7-Day Replacement Guarantee</span>
            <span>•</span>
            <span>Home & Kitchen Problem Solvers</span>
            <span>•</span>
            <span>Quality Inspected Before Dispatch</span>
            <span>•</span>
            <span>Verified Bank Transfer & COD</span>
            <span>•</span>
          </div>
          <div className="flex items-center gap-8 shrink-0">
            <span>Nationwide Express Delivery</span>
            <span>•</span>
            <span>Cash on Delivery Across Pakistan</span>
            <span>•</span>
            <span>Smart Living & Tech Innovations</span>
            <span>•</span>
            <span>7-Day Replacement Guarantee</span>
            <span>•</span>
            <span>Home & Kitchen Problem Solvers</span>
            <span>•</span>
            <span>Quality Inspected Before Dispatch</span>
            <span>•</span>
            <span>Verified Bank Transfer & COD</span>
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
