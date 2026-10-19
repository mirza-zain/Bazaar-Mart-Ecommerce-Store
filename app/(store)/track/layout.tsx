import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your MartInn streetwear & accessories shipment in real-time. Enter your Order ID or tracking code to view live dispatch and delivery updates.",
  openGraph: {
    title: "Track Your Order | MartInn",
    description:
      "Check live courier dispatch and delivery updates for your MartInn order across Pakistan.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
