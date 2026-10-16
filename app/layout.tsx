import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: {
    default: "Bazaario | Modern Fashion, Streetwear & Jewelry",
    template: "%s | Bazaario",
  },
  description:
    "Explore modern streetwear hoodies, tees, fine jewelry, and accessories at Bazaario. Free express shipping over PKR 8,000 across Pakistan with Cash on Delivery and Bank Transfer.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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

