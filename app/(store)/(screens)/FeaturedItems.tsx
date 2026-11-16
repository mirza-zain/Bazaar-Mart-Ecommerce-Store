import Link from "next/link";
import Products from "../(component)/Product";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

export default function FeaturedItems() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            Curated for you
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Trending Products
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            Top-selling smart gadgets, home utility &amp; everyday problem solvers.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse flex-col gap-3">
                <div className="aspect-square w-full rounded-2xl bg-neutral-200" />
                <div className="h-4 w-3/4 rounded bg-neutral-200" />
                <div className="h-4 w-1/2 rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        }
      >
        <Products limit={4} />
      </Suspense>
    </section>
  );
}
