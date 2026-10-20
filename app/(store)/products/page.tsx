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
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-8 border-b border-neutral-200">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900">
          Explore Catalog
        </h1>
        <p className="text-neutral-500 text-sm md:text-base mt-1">
          Filter and browse through our complete collection of smart gadgets, home utility, and everyday essentials.
        </p>
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
