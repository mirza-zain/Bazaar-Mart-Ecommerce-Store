'use client';

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Headset,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 w-full border-t border-neutral-800 bg-neutral-950 text-white">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-neutral-800/80">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 md:px-12">
          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Nationwide Delivery</h4>
              <p className="mt-0.5 text-xs text-neutral-400">Delivered across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">100% Authentic Quality</h4>
              <p className="mt-0.5 text-xs text-neutral-400">Guaranteed premium craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
              <Headset className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Dedicated Support</h4>
              <p className="mt-0.5 text-xs text-neutral-400">We are here to help you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Newsletter */}
          <div className="space-y-5 sm:col-span-2">
            <div className="flex flex-col items-start leading-none">
              <h3 className="text-3xl font-bold tracking-tight text-white">MartInn</h3>
              <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                KD Traders
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
              Your trusted destination for smart living gadgets, home &amp; kitchen utility,
              innovative toys, and everyday problem-solving essentials across Pakistan.
            </p>

            <div className="pt-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Join our VIP Club
              </p>
              {subscribed ? (
                <div className="max-w-md rounded-xl border border-neutral-700 bg-neutral-800 p-3 text-xs font-medium text-emerald-400">
                  ✓ Thank you for subscribing to MartInn VIP Club!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="min-w-0 flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 transition focus:border-white focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200 cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Shop Catalog
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/products" className="transition hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Accessories"
                  className="transition hover:text-white"
                >
                  Smart Gadgets
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Home &amp; Kitchen
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Daily Problem Solvers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/track" className="transition hover:text-white">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Browse Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href="tel:+923332244373" className="font-mono transition hover:text-white">
                  +92 333 2244373
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                <span>Karachi, Pakistan</span>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white cursor-pointer"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="border-t border-neutral-800 px-4 py-6 text-xs text-neutral-400 sm:px-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© 2020 MartInn. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-neutral-300 sm:justify-end sm:gap-3">
            <span className="rounded-full border border-neutral-800 px-3 py-1">Cash on Delivery</span>
            <span className="rounded-full border border-neutral-800 px-3 py-1">Visa</span>
            <span className="rounded-full border border-neutral-800 px-3 py-1">Mastercard</span>
            <span className="rounded-full border border-neutral-800 px-3 py-1">
              JazzCash / EasyPaisa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
