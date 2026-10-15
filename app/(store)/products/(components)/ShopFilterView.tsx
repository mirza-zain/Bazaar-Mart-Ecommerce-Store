'use client';

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Check,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Product } from "@/app/db/schema";

interface ShopFilterViewProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialSubCategory?: string;
  initialSearch?: string;
}

export default function ShopFilterView({
  initialProducts,
  initialCategory = "all",
  initialSubCategory = "all",
  initialSearch = "",
}: ShopFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceBracket, setPriceBracket] = useState<"all" | "under-3000" | "3000-6000" | "over-6000">("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic unique categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      const cat = p.category;
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    const uniqueCats = Object.keys(counts).sort();
    return [
      { name: "all", label: "All Categories", count: initialProducts.length },
      ...uniqueCats.map((cat) => ({ name: cat, label: cat, count: counts[cat] })),
    ];
  }, [initialProducts]);

  // Subcategories for current category selection
  const availableSubCategories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.subCategory) {
        if (
          selectedCategory === "all" ||
          p.category.toLowerCase() === selectedCategory.toLowerCase()
        ) {
          set.add(p.subCategory);
        }
      }
    });
    return Array.from(set).sort();
  }, [selectedCategory, initialProducts]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Subcategory filter
    if (selectedSubCategory !== "all") {
      result = result.filter(
        (p) => p.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
      );
    }

    // In-Stock Only filter
    if (inStockOnly) {
      result = result.filter((p) => Number(p.stock) > 0);
    }

    // Price bracket filter
    if (priceBracket === "under-3000") {
      result = result.filter((p) => Number(p.price) < 3000);
    } else if (priceBracket === "3000-6000") {
      result = result.filter((p) => Number(p.price) >= 3000 && Number(p.price) <= 6000);
    } else if (priceBracket === "over-6000") {
      result = result.filter((p) => Number(p.price) > 6000);
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "in-stock") {
      result.sort((a, b) => Number(b.stock) - Number(a.stock));
    } else {
      // "featured": newest first (by id desc)
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [
    initialProducts,
    selectedCategory,
    selectedSubCategory,
    inStockOnly,
    priceBracket,
    searchQuery,
    sortBy,
  ]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory("all"); // reset subcategory on category change
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setInStockOnly(false);
    setPriceBracket("all");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSubCategory !== "all" ||
    searchQuery.trim() !== "" ||
    sortBy !== "featured" ||
    inStockOnly ||
    priceBracket !== "all";

  return (
    <div className="w-full space-y-8">
      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, style, or collection..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Controls (In-stock toggle, Sort, Mobile Filter Trigger) */}
        <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
          {/* In Stock Only Checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-medium text-neutral-700 bg-white px-3.5 py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 transition">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-black border-neutral-300 focus:ring-black cursor-pointer accent-black"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-neutral-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="in-stock">Highest Stock</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category & Filter Panel (Desktop & Collapsible Mobile) */}
      <div
        className={`${
          isMobileFilterOpen ? "block" : "hidden md:block"
        } bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6 animate-in fade-in duration-200`}
      >
        {/* Row 1: Categories with Counts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Category
            </h4>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-black font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categoriesWithCounts.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? "bg-black text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Sub-Categories */}
        {availableSubCategories.length > 0 && (
          <div className="pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
              Sub-Category ({selectedCategory === "all" ? "All" : selectedCategory})
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubCategory("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedSubCategory === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 border border-neutral-200 text-neutral-600 hover:border-black"
                }`}
              >
                All Subcategories
              </button>
              {availableSubCategories.map((sub) => {
                const isSelected =
                  selectedSubCategory.toLowerCase() === sub.toLowerCase();
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-50 border border-neutral-200 text-neutral-600 hover:border-black"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 3: Price Range Brackets */}
        <div className="pt-4 border-t border-neutral-100">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
            Price Range
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Prices" },
              { id: "under-3000", label: "Under PKR 3,000" },
              { id: "3000-6000", label: "PKR 3,000 - 6,000" },
              { id: "over-6000", label: "Over PKR 6,000" },
            ].map((p) => {
              const isSelected = priceBracket === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriceBracket(p.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-50 border border-neutral-200 text-neutral-600 hover:border-black"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-500 px-1">
        <p className="text-xs sm:text-sm">
          Showing <span className="font-bold text-neutral-900">{filteredProducts.length}</span>{" "}
          of {initialProducts.length} items
        </p>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400">Active filters:</span>

            {searchQuery.trim() !== "" && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 border border-neutral-200">
                <span>&quot;{searchQuery}&quot;</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 border border-neutral-200">
                <span>{selectedCategory}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSelectedCategory("all")}
                />
              </span>
            )}

            {selectedSubCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 border border-neutral-200">
                <span>{selectedSubCategory}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSelectedSubCategory("all")}
                />
              </span>
            )}

            {priceBracket !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 border border-neutral-200">
                <span>
                  {priceBracket === "under-3000"
                    ? "< PKR 3,000"
                    : priceBracket === "3000-6000"
                    ? "PKR 3K - 6K"
                    : "> PKR 6,000"}
                </span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setPriceBracket("all")}
                />
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 border border-neutral-200">
                <span>In Stock Only</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setInStockOnly(false)}
                />
              </span>
            )}

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-neutral-900 underline ml-1 cursor-pointer hover:text-neutral-600"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-300">
          <Filter className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-neutral-800">No matching products found</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
            Try resetting your filters or adjusting your search keyword to view more items.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-4 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const stockNum = Number(item.stock);
            const isOutOfStock = stockNum <= 0;
            const isLowStock = stockNum > 0 && stockNum <= 5;

            return (
              <Link
                href={`/products/${item.id}`}
                key={item.id}
                className={`group flex flex-col gap-3 ${
                  isOutOfStock ? "opacity-75" : ""
                }`}
              >
                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/60 shadow-xs">
                  <Image
                    src={item.image || "/images/img1.jpg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Stock Badges */}
                  {isOutOfStock ? (
                    <div className="absolute top-3 left-3 bg-neutral-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      Out of Stock
                    </div>
                  ) : isLowStock ? (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Only {stockNum} Left</span>
                    </div>
                  ) : null}

                  {/* Hover Quick Action */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
                    <div className="w-full py-2.5 bg-white/95 backdrop-blur-xs text-black text-xs font-bold rounded-xl text-center shadow-md">
                      View Product
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-600 transition truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 uppercase mt-0.5">
                    <span>{item.category}</span>
                    {item.subCategory && (
                      <>
                        <span>•</span>
                        <span>{item.subCategory}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="font-bold text-neutral-900 text-base">
                      PKR {Number(item.price).toLocaleString()}
                    </p>
                    {item.variants && item.variants.length > 0 && (
                      <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {item.variants.length} sizes
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
