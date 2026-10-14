'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Essential Oversized Hoodie",
      category: "Clothing • Size M",
      price: 4500,
      quantity: 1,
      image: "/images/img1.jpg",
    },
    {
      id: 3,
      name: "Cuban Link Silver Chain",
      category: "Jewelry • 8mm Silver",
      price: 3500,
      quantity: 1,
      image: "/images/img3.jpg",
    },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 8000;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 250;
  const total = subtotal + shippingCost;

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 md:px-12 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="pb-8 border-b border-neutral-200">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900">
          Shopping Bag
        </h1>
        <p className="text-neutral-500 text-sm md:text-base mt-1">
          Review your chosen items, apply discount codes, and proceed to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-300 mt-10">
          <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-neutral-900">Your bag is empty</h2>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
            Looks like you haven&apos;t added any streetwear or accessories to your bag yet.
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 px-8 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Bar */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-2">
                <Truck className="w-4 h-4" />
                <span>
                  {subtotal >= freeShippingThreshold
                    ? "🎉 You have qualified for FREE Shipping!"
                    : `Add PKR ${(freeShippingThreshold - subtotal).toLocaleString()} more for FREE shipping!`}
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
              {items.map((item) => (
                <div key={item.id} className="py-6 flex gap-4 sm:gap-6 items-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-neutral-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.category}</p>
                    <p className="font-semibold text-sm sm:text-base text-neutral-900 mt-1">
                      PKR {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 border border-neutral-200 rounded-xl p-1 bg-neutral-50 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-neutral-500 hover:text-black rounded-lg transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-neutral-500 hover:text-black rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 transition shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 h-fit space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 pb-4 border-b border-neutral-200">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Delivery</span>
                <span>{shippingCost === 0 ? "FREE" : `PKR ${shippingCost}`}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
                <span>Total</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-neutral-400 text-center">
              Cash on Delivery & Secure Online Card payments accepted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

