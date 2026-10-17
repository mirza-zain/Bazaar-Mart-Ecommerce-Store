import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Support",
  description:
    "Get in touch with the me2one customer service team. Reach out via WhatsApp, phone, or inquiry message for sizing advice, order inquiries, and express delivery assistance across Pakistan.",
  openGraph: {
    title: "Contact Us & Support | me2one",
    description:
      "Get in touch with the me2one customer support team for orders, sizing inquiries, and delivery assistance across Pakistan.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
