'use client';

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };
  return (
    <footer className="w-full bg-neutral-900 text-white rounded-3xl mt-16 overflow-hidden">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-neutral-800 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-neutral-400 mt-0.5">On all orders over PKR 8,000</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">30-Day Easy Returns</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Hassle-free exchanges & returns</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">100% Authentic Quality</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Guaranteed premium craftsmanship</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">Bazaario</h3>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              Modern streetwear, timeless jewelry, and everyday accessories designed for individuals who move with confidence.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Join our VIP Club
              </p>
              {subscribed ? (
                <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-emerald-400 font-medium">
                  ✓ Thank you for subscribing to Bazaario VIP Club!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-white transition"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition shrink-0 cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Shop Catalog</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/products" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=Clothing" className="hover:text-white transition">Clothing</Link>
              </li>
              <li>
                <Link href="/products?category=Jewelry" className="hover:text-white transition">Jewelry & Chains</Link>
              </li>
              <li>
                <Link href="/products?category=Accessories" className="hover:text-white transition">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Customer Support</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/track" className="hover:text-white transition">Track Your Order</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Returns & Exchanges</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Get in Touch</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+923332244373" className="hover:text-white transition font-mono">
                  +92 333 2244373
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Karachi, Pakistan</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-block text-xs text-neutral-400 hover:text-white underline"
                >
                  Store Admin Console →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="border-t border-neutral-800 py-6 px-6 md:px-12 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Bazaario. All rights reserved.</p>
          <div className="flex items-center gap-3 text-neutral-300 font-medium">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>JazzCash / EasyPaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

