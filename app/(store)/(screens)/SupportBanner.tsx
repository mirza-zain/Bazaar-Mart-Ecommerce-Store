import { Headset, Lock, RotateCcw, Truck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function SupportBanner() {
  const supportItems = [
    {
      id: 1,
      title: "Free Shipping",
      subTitle: "On orders over PKR 8000",
      icon: <Truck size={32} />,
    },
    {
      id: 2,
      title: "Secure Payments",
      subTitle: "100% secure checkout",
      icon: <Lock size={32} />,
    },
    {
      id: 3,
      title: "Easy Returns",
      subTitle: "30-days return policy",
      icon: <RotateCcw size={32} />,
    },
    {
      id: 4,
      title: "24/7 Support",
      subTitle: "Always here to help",
      icon: <Headset size={32} />,
    },
  ];

  return (
    <div className="w-full px-6 md:px-12 py-2 md:py-10 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 max-w-7xl mx-auto">
        {supportItems.map((item) => (
          <Link
            href="/"
            key={item.id}
            className="flex items-center justify-start sm:justify-center gap-4 hover:opacity-75 transition-opacity"
          >
            <div className="shrink-0 text-black">{item.icon}</div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-black leading-snug">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-snug">
                {item.subTitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
