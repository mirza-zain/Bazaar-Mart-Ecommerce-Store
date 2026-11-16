'use client';

import {
  ArrowRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useCart } from "@/app/context/CartContext";
import { getStoreNavCategoriesAction, NavCategoryGroup } from "@/app/lib/actions/store";

export default function Navbar() {
  const { totalItems, isLoaded, openDrawer } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<NavCategoryGroup[]>([]);

  useEffect(() => {
    getStoreNavCategoriesAction()
      .then((cats) => {
        if (cats) setCategories(cats);
      })
      .catch((err) => console.error("Error loading navbar categories:", err));
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-neutral-100 text-neutral-950"
        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
    }`;

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const categoryColumns =
    categories.length === 1
      ? "grid-cols-1 max-w-xs"
      : categories.length === 2
      ? "grid-cols-2"
      : "grid-cols-3";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-neutral-950 text-neutral-300">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-[11px] font-medium sm:px-6 lg:px-8">
          <p className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Nationwide delivery across Pakistan</span>
          </p>
          <p className="hidden items-center gap-1.5 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Cash on Delivery • Nationwide Delivery</span>
          </p>
        </div>
      </div>

      {/* Main Nav */}
      <div className="border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl">
        <div
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          onMouseLeave={() => setShopDropdownOpen(false)}
        >
          <div className="flex h-16 items-center gap-4 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="group flex shrink-0 flex-col items-start leading-none select-none"
              onClick={() => setShopDropdownOpen(false)}
            >
              <span className="text-2xl font-semibold tracking-tight text-neutral-900 transition-opacity group-hover:opacity-70 md:text-[28px]">
                MartInn
              </span>
              <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-400 md:text-[10px]">
                KD Traders
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>

              <div className="relative">
                <Link
                  href="/products"
                  onMouseEnter={() => setShopDropdownOpen(true)}
                  onFocus={() => setShopDropdownOpen(true)}
                  onClick={() => setShopDropdownOpen(false)}
                  className={`flex items-center gap-1.5 ${navLinkClass("/products")}`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      shopDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </div>

              <Link href="/track" className={navLinkClass("/track")}>
                Track Order
              </Link>
              <Link href="/contact" className={navLinkClass("/contact")}>
                Contact
              </Link>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen((open) => !open)}
                aria-label="Search products"
                aria-expanded={searchOpen}
                className="hidden rounded-full p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black md:inline-flex cursor-pointer"
              >
                {searchOpen ? <X size={21} /> : <Search size={21} />}
              </button>

              <button
                type="button"
                onClick={openDrawer}
                aria-label="Cart"
                className="relative rounded-full p-2.5 text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-black cursor-pointer"
              >
                <ShoppingBag size={22} />
                {isLoaded && totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="inline-flex rounded-full p-2.5 text-neutral-800 transition-colors hover:bg-neutral-100 md:hidden cursor-pointer"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>
            </div>
          </div>

          {/* Desktop Search Panel */}
          {searchOpen && (
            <div className="border-t border-neutral-100 py-4">
              <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gadgets, kitchen tools, toys and more..."
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-sm font-medium text-neutral-900 placeholder-neutral-400 transition focus:border-black focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Desktop Mega Menu */}
          {shopDropdownOpen && (
            <div className="absolute left-1/2 top-full z-50 w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 pt-2">
              <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_28px_80px_-28px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 bg-neutral-50/70 px-6 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                      Shop the catalog
                    </p>
                    <h3 className="mt-0.5 text-sm font-semibold text-neutral-900">
                      Browse by category
                    </h3>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setShopDropdownOpen(false)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                  >
                    <span>View all products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="scrollbar-thin max-h-[min(58vh,480px)] overflow-y-auto p-6">
                  {categories.length > 0 ? (
                    <div className={`grid gap-6 ${categoryColumns}`}>
                      {categories.map((group) => (
                        <div key={group.category} className="space-y-2.5">
                          <Link
                            href={group.href}
                            onClick={() => setShopDropdownOpen(false)}
                            className="group flex items-center justify-between gap-2 border-b border-neutral-100 pb-2"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-900">
                              {group.category}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-black" />
                          </Link>
                          <ul className="space-y-0.5">
                            {group.subCategories.map((sub) => (
                              <li key={sub.name}>
                                <Link
                                  href={sub.href}
                                  onClick={() => setShopDropdownOpen(false)}
                                  className="block truncate rounded-lg px-2 py-1.5 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-neutral-500">
                        Explore the full collection in our store.
                      </p>
                      <Link
                        href="/products"
                        onClick={() => setShopDropdownOpen(false)}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
                      >
                        <span>Browse All Products</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-neutral-100 bg-neutral-50/70 px-6 py-3 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-emerald-600" />
                    Delivery charges calculated at checkout
                  </span>
                  <Link
                    href="/contact"
                    onClick={() => setShopDropdownOpen(false)}
                    className="font-semibold text-neutral-800 hover:text-black"
                  >
                    Need help? Contact us
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-start leading-none"
              >
                <span className="text-2xl font-semibold tracking-tight text-neutral-900">
                  MartInn
                </span>
                <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  KD Traders
                </span>
              </Link>
              <button
                type="button"
                className="rounded-full p-2.5 text-neutral-600 transition hover:bg-neutral-100 hover:text-black cursor-pointer"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="border-b border-neutral-100 px-5 py-4">
              <form onSubmit={submitSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-black focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 cursor-pointer"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Mobile Links */}
            <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-base font-semibold transition ${
                    isActive("/")
                      ? "bg-neutral-100 text-neutral-950"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Home
                </Link>

                <div>
                  <button
                    type="button"
                    onClick={() => setMobileShopOpen((open) => !open)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold transition cursor-pointer ${
                      isActive("/products")
                        ? "bg-neutral-100 text-neutral-950"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileShopOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileShopOpen && (
                    <div className="scrollbar-thin mt-1 max-h-[42vh] space-y-4 overflow-y-auto rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4">
                      {categories.length > 0 ? (
                        categories.map((group) => (
                          <div key={group.category}>
                            <Link
                              href={group.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-900"
                            >
                              <span>{group.category}</span>
                              <ArrowRight className="h-3 w-3 text-neutral-400" />
                            </Link>
                            <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5">
                              {group.subCategories.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setMenuOpen(false)}
                                  className="truncate rounded-lg py-1.5 text-xs text-neutral-600 hover:text-black"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-1 text-center text-xs text-neutral-500">
                          Explore the full collection in our store.
                        </p>
                      )}

                      <Link
                        href="/products"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white"
                      >
                        <span>Browse All Products</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/track"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-base font-semibold transition ${
                    isActive("/track")
                      ? "bg-neutral-100 text-neutral-950"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Track Order
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-base font-semibold transition ${
                    isActive("/contact")
                      ? "bg-neutral-100 text-neutral-950"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="border-t border-neutral-100 px-5 py-4">
              <a
                href="https://wa.me/923332244373"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-xs font-semibold text-white transition hover:bg-neutral-800"
              >
                <span>Need help? Chat on WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <p className="mt-3 text-center text-[10px] text-neutral-400">
                © 2020 MartInn. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
