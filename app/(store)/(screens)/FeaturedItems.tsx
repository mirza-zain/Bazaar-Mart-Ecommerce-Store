import Link from "next/link";
import Products from "../(component)/Product";
import { Suspense } from "react";

export default function FeaturedItems() {
  return (
    <div className="w-full px-5 md:px-16 py-16 mt-10">
      <div className="w-full flex md:flex-row flex-col md:justify-between md:items-center gap-2 md:gap-5">
        <h2 className="text-4xl md:text-5xl font-medium uppercase">Explore items</h2>
        <Link href={'/products'} className="w-full md:w-auto text-right underline text-lg text-blue-800 cursor-pointer">Show All</Link>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-3">
              <div className="w-full aspect-square bg-neutral-200 rounded-2xl" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      }>
        <Products limit={4} />
      </Suspense>
    </div>
  );
}
