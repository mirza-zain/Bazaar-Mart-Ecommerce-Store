'use client';

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Lock,
  Package,
  ShieldCheck,
  Smartphone,
  Tag,
  Trash2,
  Truck,
  Upload,
  X,
} from "lucide-react";
import {
  createOrderAction,
  validateDiscountCodeAction,
} from "@/app/lib/actions/checkout";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutPage() {
  const { items, clearCart, isLoaded } = useCart();

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

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFeedback, setDiscountFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 8000 ? 0 : 250;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsValidatingCode(true);
    setDiscountFeedback(null);

    startTransition(async () => {
      const res = await validateDiscountCodeAction(promoCode, subtotal);
      setIsValidatingCode(false);
      if (res.valid && res.discountPercent) {
        setDiscountPercent(res.discountPercent);
        setAppliedCode(res.code || promoCode.trim().toUpperCase());
        setDiscountFeedback({
          type: "success",
          message: `Code ${res.code} applied! ${res.discountPercent}% discount added.`,
        });
      } else {
        setDiscountFeedback({
          type: "error",
          message: res.error || "Invalid discount code.",
        });
      }
    });
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setAppliedCode(null);
    setPromoCode("");
    setDiscountFeedback(null);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPaymentProof(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (paymentMethod === "bank_transfer" && !paymentProof) {
      setErrorMessage("Please upload a screenshot of your payment transfer before placing the order.");
      return;
    }

    if (paymentMethod === "cod" && formData.city.toLowerCase() !== "karachi") {
      setErrorMessage("Cash on Delivery (COD) is currently only available for deliveries within Karachi. Please select Bank Transfer.");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    startTransition(async () => {
      const res = await createOrderAction({
        customerName: fullName,
        customerEmail: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        totalAmount: grandTotal,
        paymentMethod,
        paymentProof: paymentProof || undefined,
        discountCode: appliedCode || undefined,
        discountAmount,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          variant: i.variant,
          image: i.image,
        })),
      });

      if (res.success && res.orderId) {
        clearCart();
        setPlacedOrderId(res.orderId);
      } else {
        setErrorMessage(res.error || "Failed to place order.");
      }
    });
  };

  if (!placedOrderId && !isLoaded) {
    return (
      <div className="w-full max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="inline-block w-8 h-8 border-3 border-neutral-300 border-t-black rounded-full animate-spin mb-3" />
        <p className="text-sm text-neutral-500">Preparing checkout session...</p>
      </div>
    );
  }

  if (!placedOrderId && isLoaded && items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-5 py-16 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            You don&apos;t have any items in your checkout session. Explore our catalog and add items to your cart to complete an order.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block px-8 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="font-medium text-neutral-900">{formData.email}</span>.{" "}
            {paymentMethod === "bank_transfer" ? (
              <span className="text-emerald-700 font-medium block mt-1">
                Your payment screenshot has been uploaded. Our admin team will verify it shortly and dispatch your package!
              </span>
            ) : (
              <span>Your order will be dispatched via express courier with Cash on Delivery.</span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href={`/track?orderId=${placedOrderId}`}
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
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setFormData((prev) => ({ ...prev, city: newCity }));
                    if (newCity.toLowerCase() !== "karachi" && paymentMethod === "cod") {
                      setPaymentMethod("bank_transfer");
                    }
                  }}
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

          {/* Section 3: Payment Option */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">3. Payment Option</h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                {paymentMethod === "cod" ? "Pay on Delivery" : "Manual Transfer"}
              </span>
            </div>

            {/* City COD Notice if not Karachi */}
            {formData.city.toLowerCase() !== "karachi" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Cash on Delivery (COD) is exclusively available for deliveries within <strong>Karachi</strong>. For shipments to <strong>{formData.city}</strong>, please complete payment via Direct Bank Transfer or EasyPaisa.
                </span>
              </div>
            )}

            <div className="space-y-3">
              {/* COD Option */}
              {formData.city.toLowerCase() === "karachi" ? (
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
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-900">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Karachi Only
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500">Pay cash directly to courier at your doorstep</span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-neutral-400 shrink-0" />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      checked={false}
                      className="accent-black w-4 h-4 cursor-not-allowed"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-500">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] bg-neutral-200 text-neutral-600 font-bold px-2 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400">
                        Only available for addresses in Karachi
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-neutral-300 shrink-0" />
                </div>
              )}

              {/* Bank Transfer / Wallet Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "bank_transfer"
                    ? "border-black bg-neutral-50 ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-sm text-neutral-900 block">
                      Direct Bank Transfer / EasyPaisa / JazzCash
                    </span>
                    <span className="text-xs text-neutral-500">
                      Transfer to our account & upload screenshot of payment
                    </span>
                  </div>
                </div>
                <Building2 className="w-5 h-5 text-neutral-400 shrink-0" />
              </label>
            </div>

            {/* Bank Transfer Details & Screenshot Upload Form */}
            {paymentMethod === "bank_transfer" && (
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Official Payment Account Details</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Please transfer the exact total amount (
                    <span className="font-bold text-neutral-900">PKR {grandTotal.toLocaleString()}</span>
                    ) to any of the following accounts:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Bank Option */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-neutral-800">
                      <span>Meezan Bank</span>
                      <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px]">Bank</span>
                    </div>
                    <p className="text-neutral-500">Title: <span className="text-neutral-900 font-medium">BAZZARIO OFFICIAL</span></p>
                    <p className="text-neutral-500 font-mono">Acc: <span className="text-neutral-900 font-semibold select-all">01020108392019</span></p>
                    <p className="text-neutral-500 font-mono text-[11px]">IBAN: <span className="text-neutral-900 select-all">PK36MEZN0001020108392019</span></p>
                  </div>

                  {/* Digital Wallet Option */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-neutral-800">
                      <span>EasyPaisa / JazzCash / Raast</span>
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px]">Instant</span>
                    </div>
                    <p className="text-neutral-500">Title: <span className="text-neutral-900 font-medium">BAZZARIO</span></p>
                    <p className="text-neutral-500 font-mono">Number: <span className="text-neutral-900 font-semibold select-all">0300-1234567</span></p>
                    <p className="text-neutral-500 text-[11px]">Raast ID: <span className="text-neutral-900 select-all">03001234567</span></p>
                  </div>
                </div>

                {/* Screenshot Upload Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase">
                    Upload Payment Screenshot (Receipt) *
                  </label>

                  {paymentProof ? (
                    <div className="relative p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                          <Image
                            src={paymentProof}
                            alt="Payment Screenshot"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Screenshot Attached
                          </p>
                          <p className="text-[11px] text-neutral-400">Ready for admin verification</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPaymentProof(null)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove screenshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white group">
                      <Upload className="w-6 h-6 text-neutral-400 group-hover:text-black mb-2 transition" />
                      <span className="text-xs font-semibold text-neutral-800">
                        Click or drag to upload receipt screenshot
                      </span>
                      <span className="text-[11px] text-neutral-400 mt-0.5">
                        PNG, JPG, JPEG up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
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
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image src={item.image || "/images/img1.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Qty: {item.quantity}</span>
                      {item.variant && (
                        <span className="font-medium text-neutral-700">• {item.variant}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 shrink-0">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="pt-2 border-t border-neutral-200 space-y-2">
              {appliedCode ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon: {appliedCode} (-{discountPercent}%)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-neutral-400 hover:text-neutral-800 text-xs font-semibold p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Discount code (e.g. BAZAAR10)"
                    className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs uppercase focus:outline-hidden focus:border-black font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isValidatingCode || !promoCode.trim()}
                    className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                  >
                    {isValidatingCode ? "Checking..." : "Apply"}
                  </button>
                </div>
              )}

              {discountFeedback && (
                <p
                  className={`text-xs ${
                    discountFeedback.type === "success" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {discountFeedback.message}
                </p>
              )}
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

