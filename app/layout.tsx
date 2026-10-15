import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";

export const metadata: Metadata = {
  title: {
    default: "Bazaario | Modern Fashion, Streetwear & Jewelry",
    template: "%s | Bazaario",
  },
  description:
    "Explore modern streetwear hoodies, tees, fine jewelry, and accessories at Bazaario. Free express shipping over PKR 8,000 across Pakistan with Cash on Delivery and Bank Transfer.",
  keywords: [
    "Bazaario",
    "streetwear Pakistan",
    "online clothing Karachi",
    "hoodies Pakistan",
    "jewelry",
    "fashion accessories",
  ],
  openGraph: {
    title: "Bazaario | Modern Fashion, Streetwear & Jewelry",
    description:
      "Explore modern streetwear hoodies, tees, fine jewelry, and accessories at Bazaario. Free delivery over PKR 8,000 nationwide.",
    siteName: "Bazaario",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bazaario | Modern Fashion, Streetwear & Jewelry",
    description:
      "Discover high-quality streetwear, fine jewelry, and everyday accessories at Bazaario.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

