'use client';

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Product } from "@/app/db/schema";

interface ShopFilterViewProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialSubCategory?: string;
}

const categoryStructure: Record<string, string[]> = {
  Clothing: ["Hoodie", "T-Shirt", "Jackets"],
  Jewelry: ["Necklaces", "Rings", "Bracelets"],
  Accessories: ["Eyewear", "Bags", "Watches"],
};

export default function ShopFilterView({
  initialProducts,
  initialCategory = "all",
  initialSubCategory = "all",
}: ShopFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available subcategories based on chosen category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === "all") {
      // Gather all unique subcategories from all products
      const set = new Set<string>();
      initialProducts.forEach((p) => {
        if (p.subCategory) set.add(p.subCategory);
      });
      return Array.from(set);
    }
    return categoryStructure[selectedCategory] || [];
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

    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [initialProducts, selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory("all"); // reset subcategory on category change
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSubCategory !== "all" ||
    searchQuery.trim() !== "" ||
    sortBy !== "featured";

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
            placeholder="Search products by name or style..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Controls (Sort & Mobile Filter Trigger) */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-neutral-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:outline-hidden focus:border-black"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category & Subcategory Filter Tabs (Desktop & Collapsible Mobile) */}
      <div
        className={`${
          isMobileFilterOpen ? "block" : "hidden md:block"
        } bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6`}
      >
        {/* Row 1: Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Category
            </h4>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-neutral-500 hover:text-black underline font-medium cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "Clothing", "Jewelry", "Accessories"].map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-black text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
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
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-neutral-500 px-1">
        <p>
          Showing <span className="font-semibold text-neutral-900">{filteredProducts.length}</span>{" "}
          products
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Filtered by:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-neutral-100 rounded-md text-neutral-800">
                {selectedCategory}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSelectedCategory("all")}
                />
              </span>
            )}
            {selectedSubCategory !== "all" && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-neutral-100 rounded-md text-neutral-800">
                {selectedSubCategory}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSelectedSubCategory("all")}
                />
              </span>
            )}
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
            onClick={handleClearFilters}
            className="mt-4 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <Link
              href={`/products/${item.id}`}
              key={item.id}
              className="group flex flex-col gap-3"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/60 shadow-xs">
                <Image
                  src={item.image || "/images/img1.jpg"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition truncate">
                  {item.name}
                </h3>
                <div className="flex gap-2 text-xs text-neutral-400 uppercase mt-0.5">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.subCategory}</span>
                </div>
                <p className="font-semibold text-neutral-900 mt-1">
                  PKR {Number(item.price).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

