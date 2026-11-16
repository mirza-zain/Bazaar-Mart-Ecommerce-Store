import { Headset, Lock, Truck } from "lucide-react";
import React from "react";

export default function SupportBanner() {
  const supportItems = [
    {
      id: 1,
      title: "Nationwide Delivery",
      subTitle: "Delivered across Pakistan",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Secure Payments",
      subTitle: "100% secure checkout",
      icon: <Lock className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "24/7 Support",
      subTitle: "Always here to help",
      icon: <Headset className="h-5 w-5" />,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="grid grid-cols-1 divide-y divide-neutral-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {supportItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-5 transition-colors hover:bg-neutral-50/70 sm:justify-center sm:px-6 sm:py-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold leading-snug text-neutral-900 sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs leading-snug text-neutral-500 sm:text-sm">
                  {item.subTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
