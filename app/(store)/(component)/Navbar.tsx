'use client';

import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { getStoreNavCategoriesAction, NavCategoryGroup } from "@/app/lib/actions/store";

export default function Navbar() {
  const { totalItems, isLoaded, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
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

  return (
    <nav className="relative w-full py-5 flex justify-between items-center px-5 z-50 bg-white border-b border-neutral-100">
      <div className="md:mx-5">
        <Link href="/">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Bazaario</h2>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <ul className="flex justify-center items-center gap-10">
          <li className="text-lg font-medium tracking-wider hover:opacity-70 transition-opacity">
            <Link href="/">Home</Link>
          </li>

          {/* Shop with Mega Dropdown */}
          <li
            className="relative py-2"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-lg font-medium tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  shopDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu */}
            {shopDropdownOpen && (
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 ${
                  categories.length === 1
                    ? "w-[280px]"
                    : categories.length === 2
                    ? "w-[420px]"
                    : "w-[540px]"
                } bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 z-50`}
              >
                {categories.length > 0 ? (
                  <div
                    className={`grid ${
                      categories.length === 1
                        ? "grid-cols-1"
                        : categories.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    } gap-6`}
                  >
                    {categories.map((group) => (
                      <div key={group.category} className="space-y-3">
                        <Link
                          href={group.href}
                          onClick={() => setShopDropdownOpen(false)}
                          className="block font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1.5 hover:text-black"
                        >
                          {group.category}
                        </Link>
                        <ul className="space-y-2">
                          {group.subCategories.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                onClick={() => setShopDropdownOpen(false)}
                                className="block text-xs text-neutral-600 hover:text-black hover:translate-x-1 transition-all"
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
                  <div className="py-2 text-center text-xs text-neutral-500 space-y-2">
                    <p>Explore all available drops in our store.</p>
                    <Link
                      href="/products"
                      onClick={() => setShopDropdownOpen(false)}
                      className="inline-block px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition"
                    >
                      Browse All Catalog
                    </Link>
                  </div>
                )}
                <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Live drops from catalog</span>
                  <Link
                    href="/products"
                    onClick={() => setShopDropdownOpen(false)}
                    className="font-semibold text-black hover:underline"
                  >
                    View All Catalog →
                  </Link>
                </div>
              </div>
            )}
          </li>

          <li className="text-lg font-medium tracking-wider hover:opacity-70 transition-opacity">
            <Link href="/contact">Contact</Link>
          </li>
          <li className="text-lg font-medium tracking-wider hover:opacity-70 transition-opacity">
            <Link href="/track">Track</Link>
          </li>
        </ul>
      </div>

      {/* Action Icons */}
      <div className="flex justify-center items-center gap-6 md:gap-10 md:mx-5">
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Cart"
          className="relative p-1 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <ShoppingBag size={25} />
          {isLoaded && totalItems > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>
        <button
          type="button"
          className="md:hidden cursor-pointer"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={25} />
        </button>
      </div>

      {/* Full-screen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 md:hidden overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center w-full pb-4 border-b border-neutral-100">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <h2 className="text-3xl font-semibold">Bazaario</h2>
            </Link>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openDrawer();
                }}
                aria-label="Cart"
                className="relative cursor-pointer"
              >
                <ShoppingBag size={25} />
                {isLoaded && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="cursor-pointer p-1"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Centered Navigation Links with Accordion for Shop */}
          <div className="flex flex-col items-center justify-center flex-1 my-6 w-full">
            <ul className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium tracking-wider hover:opacity-70 transition-opacity"
                >
                  Home
                </Link>
              </li>

              {/* Shop Mobile Accordion */}
              <li className="w-full">
                <button
                  type="button"
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="flex items-center justify-center gap-2 text-2xl font-medium tracking-wider w-full py-1 hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      mobileShopOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileShopOpen && (
                  <div className="mt-3 p-4 bg-neutral-50 rounded-2xl space-y-4 text-left max-h-[45vh] overflow-y-auto border border-neutral-200/60">
                    {categories.length > 0 ? (
                      categories.map((group) => (
                        <div key={group.category} className="space-y-1.5">
                          <Link
                            href={group.href}
                            onClick={() => setMenuOpen(false)}
                            className="block text-xs font-bold text-neutral-900 uppercase tracking-wider"
                          >
                            {group.category}
                          </Link>
                          <div className="grid grid-cols-2 gap-1.5 pl-2">
                            {group.subCategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-xs text-neutral-600 hover:text-black py-1"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-xs text-neutral-500">
                        <p>Explore all available drops in our store.</p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-neutral-200 text-center">
                      <Link
                        href="/products"
                        onClick={() => setMenuOpen(false)}
                        className="text-xs font-semibold text-black underline"
                      >
                        Browse All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              <li>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium tracking-wider hover:opacity-70 transition-opacity"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/track"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium tracking-wider hover:opacity-70 transition-opacity"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Footer */}
          <div className="text-center text-xs text-neutral-400 pb-2 border-t border-neutral-100 pt-3">
            <p>© Bazaario. All rights reserved.</p>
          </div>
        </div>
      )}
    </nav>
  );
}
