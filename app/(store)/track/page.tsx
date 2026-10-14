'use client';

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Package, Search, Truck, AlertCircle } from "lucide-react";
import { trackOrderAction } from "@/app/lib/actions/orderTracking";
import { Order } from "@/app/db/schema";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(async () => {
      const found = await trackOrderAction(query);
      setOrder(found);
      setSearched(true);
    });
  };

  const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];

  const getStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "processing") return 1;
    return 0; // pending / order placed
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-5 md:px-12 py-10">
      {/* Back to Home */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="text-center pb-8 border-b border-neutral-200">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900">
          Track Your Order
        </h1>
        <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-md mx-auto">
          Enter your Order ID (e.g., #ORD-0001 or 1) or the email address used during checkout.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="mt-8">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. #ORD-0001 or ahmad.k@gmail.com"
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-hidden focus:border-black transition"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3.5 bg-black text-white text-sm font-semibold rounded-2xl hover:bg-neutral-800 transition cursor-pointer shadow-xs shrink-0"
          >
            {isPending ? "Tracking..." : "Track Package"}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {searched && (
        <div className="mt-10">
          {order ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                    Tracking Details
                  </span>
                  <h3 className="text-2xl font-bold text-neutral-900 font-mono mt-0.5">
                    #ORD-{order.id.toString().padStart(4, "0")}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Customer: <span className="text-neutral-900 font-medium">{order.customerName}</span> ({order.customerEmail})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {steps.map((step, idx) => {
                    const currentIdx = getStepIndex(order.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition ${
                            isCompleted
                              ? "bg-black text-white"
                              : "bg-neutral-100 text-neutral-400"
                          } ${isCurrent ? "ring-4 ring-neutral-200" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            isCompleted ? "text-neutral-900 font-bold" : "text-neutral-400"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items summary */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center text-sm font-semibold text-neutral-900 mb-2">
                  <span>Order Total:</span>
                  <span>PKR {Number(order.totalAmount).toLocaleString()}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Payment Method: Cash on Delivery • Estimated Courier: Leopard / TCS Express
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-lg font-bold text-neutral-900">Order Not Found</h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                No active order found for &quot;{query}&quot;. Please double check your order number or email, or contact support.
              </p>
              <Link
                href="/contact"
                className="inline-block text-xs font-semibold text-black underline mt-2"
              >
                Contact Customer Support →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

