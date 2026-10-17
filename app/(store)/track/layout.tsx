import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your me2one streetwear & accessories shipment in real-time. Enter your Order ID or tracking code to view live dispatch and delivery updates.",
  openGraph: {
    title: "Track Your Order | me2one",
    description:
      "Check live courier dispatch and delivery updates for your me2one order across Pakistan.",
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
