'use client';

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { createOrderAction } from "@/app/lib/actions/checkout";

type CheckoutItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function CheckoutPage() {
  const [items] = useState<CheckoutItem[]>([
    {
      productId: 1,
      name: "Essential Oversized Hoodie",
      price: 4500,
      quantity: 1,
      image: "/images/img1.jpg",
    },
    {
      productId: 3,
      name: "Cuban Link Silver Chain",
      price: 3500,
      quantity: 1,
      image: "/images/img3.jpg",
    },
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Karachi",
    postalCode: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 8000 ? 0 : 250;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "BAZAAR10") {
      setDiscountPercent(10);
      alert("Promo code BAZAAR10 applied! 10% discount added.");
    } else {
      alert("Invalid promo code. Try 'BAZAAR10'");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    startTransition(async () => {
      const res = await createOrderAction({
        customerName: fullName,
        customerEmail: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        totalAmount: grandTotal,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      if (res.success && res.orderId) {
        setPlacedOrderId(res.orderId);
      } else {
        setErrorMessage(res.error || "Failed to place order.");
      }
    });
  };

  if (placedOrderId) {
    const formattedId = `#ORD-${placedOrderId.toString().padStart(4, "0")}`;
    return (
      <div className="w-full max-w-2xl mx-auto px-5 py-16 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Order Placed Successfully!
          </h1>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 inline-block">
            <span className="text-xs uppercase font-semibold text-neutral-400">Your Order Number</span>
            <p className="text-2xl font-mono font-bold text-neutral-900 mt-0.5">{formattedId}</p>
          </div>

          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-neutral-900">{formData.firstName}</span>! We have sent confirmation details to{" "}
            <span className="font-medium text-neutral-900">{formData.email}</span>. Your order will be dispatched via express courier with Cash on Delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/track"
              className="px-6 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition"
            >
              Track Order Status
            </Link>
            <Link
              href="/products"
              className="px-6 py-3.5 bg-neutral-100 text-neutral-800 text-sm font-semibold rounded-xl hover:bg-neutral-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-5 md:px-12 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Bag</span>
        </Link>
      </div>

      <div className="pb-8 border-b border-neutral-200">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900">
          Checkout
        </h1>
        <p className="text-neutral-500 text-sm md:text-base mt-1">
          Complete your delivery and payment details to confirm your order.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
        {/* Left Form: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">1. Contact Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Phone Number (For Courier) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0300 1234567"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">2. Shipping Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Ali"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Khan"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Street Address & House / Flat # *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House # 12-B, Street 4, Sector F-7/2"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Other">Other City</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="75500"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">3. Payment Option</h2>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-black w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-sm text-neutral-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-xs text-neutral-500">Pay cash when courier delivers package</span>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-neutral-400" />
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-black w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-sm text-neutral-900 block">
                      Credit / Debit Card (Online)
                    </span>
                    <span className="text-xs text-neutral-500">Visa, Mastercard, PayPak</span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-neutral-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200">
              Order Items ({items.length})
            </h2>

            {/* Items Mini List */}
            <div className="divide-y divide-neutral-200 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 shrink-0">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="pt-2 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Discount code (try BAZAAR10)"
                  className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs uppercase focus:outline-hidden focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs font-semibold rounded-xl transition"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-sm pt-3 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>- PKR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `PKR ${shippingFee}`}</span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-bold text-neutral-900">
                <span>Total Amount</span>
                <span>PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isPending ? "Placing Order..." : "Confirm & Place Order"}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted & secure checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

