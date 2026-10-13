'use client'

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/" },
  { name: "Contact", href: "/" },
  { name: "Track", href: "/" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="relative w-full py-5 flex justify-between items-center px-5 z-50 bg-white border-b">
      <div className="md:mx-5">
        <Link href="/">
          <h2 className="text-4xl font-semibold text-center">Bazaar Mart</h2>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <ul className="flex justify-center items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.name} className="text-lg font-medium tracking-wider hover:opacity-70 transition-opacity">
              <Link href={link.href}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Icons */}
      <div className="flex justify-center items-center gap-6 md:gap-10 md:mx-5">
        {/* <Link href={'/'}><Search size={25} /></Link> */}
        <Link href="/" aria-label="Cart">
          <ShoppingBag size={25} />
        </Link>
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
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 md:hidden">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center w-full">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <h2 className="text-4xl font-medium font-[gilam]">Bazaario</h2>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Cart">
                <ShoppingBag size={25} />
              </Link>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Centered Navigation Links */}
          <div className="flex flex-col items-center justify-center flex-1 my-8">
            <ul className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-medium tracking-wider hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Footer */}
          <div className="text-center text-sm text-gray-500 pb-2">
            <p>© Bazaario. All rights reserved.</p>
          </div>
        </div>
      )}
    </nav>
  );
}
