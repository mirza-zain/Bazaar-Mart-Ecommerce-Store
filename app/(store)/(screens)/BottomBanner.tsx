import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BottomBanner() {
  const showcase = [
    { src: "/images/smart_gadgets.jpg", label: "Smart Gadgets" },
    { src: "/images/home_kitchen.jpg", label: "Home & Kitchen" },
    { src: "/images/toys_fun.jpg", label: "Toys & Learning" },
    { src: "/images/daily_utility.jpg", label: "Daily Essentials" },
  ];

  return (
    <section className="mx-auto my-12 w-full max-w-7xl px-4 sm:px-6 md:my-16 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 p-6 text-white sm:p-10 lg:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div className="flex flex-col items-start gap-5">
            <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-300">
              Everyday convenience, delivered
            </span>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Clever Tools That Make Everyday Life Easier
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-neutral-400 sm:text-base">
              Smart gadgets, home innovations and daily problem solvers — quality checked and
              delivered across Pakistan.
            </p>

            <Link
              href="/products"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black shadow-sm transition hover:bg-neutral-200 sm:w-auto sm:text-base"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[11px] font-medium text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-400" />
                Nationwide delivery
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Quality checked
              </span>
            </div>
          </div>

          {/* Category Showcase */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {showcase.map((item) => (
              <div
                key={item.label}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-white sm:text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
