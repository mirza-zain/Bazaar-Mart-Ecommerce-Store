import React from "react";
import { Check, Percent, Tag, Zap } from "lucide-react";

export default function PricingRulesPage() {
  const activeRules = [
    {
      id: 1,
      name: "Free Shipping Threshold",
      rule: "Orders above PKR 8,000",
      type: "Shipping",
      status: "Active",
      discount: "100% OFF Shipping",
    },
    {
      id: 2,
      name: "Seasonal Launch Discount",
      rule: "Applies to Hoodies and Streetwear Tees",
      type: "Product",
      status: "Active",
      discount: "15% OFF",
    },
    {
      id: 3,
      name: "Bundle & Save",
      rule: "Buy 2 accessories get 1 at 20% off",
      type: "Bundle",
      status: "Scheduled",
      discount: "20% OFF",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Pricing & Discount Rules
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure dynamic discounts, promo vouchers, and free shipping logic.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer">
          <Tag className="w-4 h-4" />
          <span>New Pricing Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase">Active Campaigns</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">2 Live</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase">Auto Discounter</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">Enabled</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase">Free Shipping Rule</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">PKR 8,000</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Configured Store Rules</h2>
        <div className="divide-y divide-neutral-100">
          {activeRules.map((rule) => (
            <div key={rule.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-neutral-900">{rule.name}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      rule.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{rule.rule}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-neutral-900 px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-lg">
                  {rule.discount}
                </span>
                <span className="text-xs text-neutral-400 uppercase font-medium">{rule.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

