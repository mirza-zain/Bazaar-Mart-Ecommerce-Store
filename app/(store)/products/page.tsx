import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getStoreProducts } from "@/app/lib/actions/store";
import ShopFilterView from "./(components)/ShopFilterView";

interface Props {
  searchParams: Promise<{ category?: string; subCategory?: string; search?: string }>;
}

export const instant = false;

export const metadata: Metadata = {
  title: "Explore Catalog | Smart Gadgets, Home Utility & Trending Essentials",
  description:
    "Filter and browse through our complete collection of smart gadgets, home & kitchen utility, innovative toys, and everyday essentials at MartInn (KD Traders).",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Explore Catalog | MartInn Smart Gadgets & Utility Essentials",
    description:
      "Filter and browse through our complete collection of smart gadgets, home utility, innovative toys, and daily problem solvers at MartInn.",
  },
};

export default async function ProductsCatalogPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.category || "all";
  const activeSubCategory = resolvedParams?.subCategory || "all";
  const activeSearch = resolvedParams?.search || "";

  const allProducts = await getStoreProducts();

  return (
    <div className="w-full max-w-7xl mx-auto px-5 md:px-12 py-10">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="hidden text-xs font-medium uppercase tracking-wider text-neutral-400 sm:block">
          Home / Catalog
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            Shop the full range
          </p>
          <h1 className="mt-1 text-4xl font-bold uppercase tracking-tight text-neutral-900 md:text-5xl">
            Explore Catalog
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 md:text-base">
            Filter and browse through our complete collection of smart gadgets, home utility,
            and everyday essentials.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-3.5">
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            {allProducts.length}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Products
            <br />
            Available
          </span>
        </div>
      </div>

      {/* Interactive Filter & Product View */}
      <div className="mt-8">
        <ShopFilterView
          initialProducts={allProducts}
          initialCategory={activeCategory}
          initialSubCategory={activeSubCategory}
          initialSearch={activeSearch}
        />
      </div>
    </div>
  );
}
