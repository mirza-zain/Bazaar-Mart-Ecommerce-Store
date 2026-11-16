import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
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
      image: "/images/smart_gadgets.jpg",
      tag: "Trending Tech",
    },
    {
      title: "Home & Kitchen Utility",
      subtitle: "Clever Organizers & Daily Tools",
      href: "/products?category=Accessories",
      image: "/images/home_kitchen.jpg",
      tag: "Home Utility",
    },
    {
      title: "Toys, Fun & Learning",
      subtitle: "Novelty Gifts & Family Play",
      href: "/products",
      image: "/images/toys_fun.jpg",
      tag: "Kids & Family",
    },
    {
      title: "Daily Problem Solvers",
      subtitle: "Personal Care, Safety & Lifehacks",
      href: "/products",
      image: "/images/daily_utility.jpg",
      tag: "Best Sellers",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-neutral-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,#f5f5f5_0%,#ffffff_70%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pt-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-black" />
              <span>Est. 2020 • Smart Living Essentials</span>
            </div>

            <h1 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-6xl md:text-7xl">
              Smart Living
              <br className="hidden sm:block" />
              <span className="font-normal text-neutral-400"> &amp; Daily Essentials</span>
            </h1>

            <p className="max-w-xl text-sm font-normal leading-relaxed text-neutral-600 sm:text-base md:text-lg">
              Discover clever smart gadgets, home &amp; kitchen utility, innovative toys, and
              everyday problem-solving essentials crafted for effortless convenience across
              Pakistan.
            </p>

            <div className="flex w-full flex-col items-center gap-3 pt-1 sm:w-auto sm:flex-row">
              <Link
                href="/products"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:w-auto sm:text-base"
              >
                <span>Explore All Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/products?category=Accessories"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 sm:w-auto sm:text-base"
              >
                <span>Trending Gadgets &amp; Tools</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 shrink-0 text-black" />
                <span>Nationwide Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-black" />
                <span>Cash on Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Editorial Showcase Grid */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 lg:grid-cols-4">
            {editorialCollections.map((col, idx) => (
              <Link
                key={idx}
                href={col.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-sm ring-1 ring-black/5 sm:rounded-3xl sm:aspect-[3/4]"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  priority={idx < 2}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                  <span className="rounded-lg bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black shadow-xs backdrop-blur-xs sm:px-2.5 sm:py-1 sm:text-[10px]">
                    {col.tag}
                  </span>
                </div>

                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-tight text-white group-hover:underline sm:text-lg">
                      {col.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-neutral-300 sm:text-xs">
                      {col.subtitle}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition group-hover:bg-white group-hover:text-black sm:h-9 sm:w-9">
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Brand Ticker */}
      <div className="w-full overflow-hidden border-y border-neutral-800 bg-black py-3 text-white">
        <div className="animate-scroll-left flex w-max gap-8 text-[11px] font-bold uppercase tracking-widest sm:text-xs">
          <div className="flex shrink-0 items-center gap-8">
            <span>Nationwide Express Delivery</span>
            <span>•</span>
            <span>Cash on Delivery Across Pakistan</span>
            <span>•</span>
            <span>Smart Living &amp; Tech Innovations</span>
            <span>•</span>
            <span>Home &amp; Kitchen Problem Solvers</span>
            <span>•</span>
            <span>Quality Inspected Before Dispatch</span>
            <span>•</span>
            <span>Verified Bank Transfer &amp; COD</span>
            <span>•</span>
          </div>
          <div className="flex shrink-0 items-center gap-8">
            <span>Nationwide Express Delivery</span>
            <span>•</span>
            <span>Cash on Delivery Across Pakistan</span>
            <span>•</span>
            <span>Smart Living &amp; Tech Innovations</span>
            <span>•</span>
            <span>Home &amp; Kitchen Problem Solvers</span>
            <span>•</span>
            <span>Quality Inspected Before Dispatch</span>
            <span>•</span>
            <span>Verified Bank Transfer &amp; COD</span>
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
