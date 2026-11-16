import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description:
    "Review items in your MartInn shopping bag before proceeding to checkout.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
