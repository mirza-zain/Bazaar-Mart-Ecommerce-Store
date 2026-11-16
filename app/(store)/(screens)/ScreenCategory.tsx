import { ArrowRight, ArrowUpRight, Cpu, Home, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ScreenCategory() {
  const items = [
    {
      id: 1,
      category: "Smart Gadgets",
      description: "Rechargeable tech, accessories and modern everyday tools.",
      href: "/products?category=Accessories",
      icon: <Cpu className="h-6 w-6" />,
    },
    {
      id: 2,
      category: "Home & Kitchen",
      description: "Clever organizers, cooking helpers and space savers.",
      href: "/products",
      icon: <Home className="h-6 w-6" />,
    },
    {
      id: 3,
      category: "Utility & Essentials",
      description: "Daily problem solvers, personal care and lifehacks.",
      href: "/products",
      icon: <Sparkles className="h-6 w-6" />,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            Browse the store
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Explore Categories
          </h2>
          <p className="mt-1.5 max-w-lg text-sm text-neutral-500">
            Find exactly what you need, organized into the collections our customers shop most.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          <span>View all products</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-50 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-100/80 hover:shadow-md sm:p-7"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-6 text-[110px] font-black leading-none text-neutral-200/60 transition group-hover:text-neutral-200"
            >
              0{index + 1}
            </span>

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm transition group-hover:scale-105">
                {item.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                {item.category}
              </h3>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-neutral-500">
                {item.description}
              </p>
            </div>

            <div className="relative mt-8 flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
              <span>Shop collection</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
