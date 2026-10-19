import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  themeColor: "#09090b",
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://me2one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MartInn | Modern Fashion, Streetwear & Jewelry (KD Traders)",
    template: "%s | MartInn",
  },
  description:
    "Explore modern streetwear hoodies, graphic tees, fine jewelry, and everyday accessories at MartInn (affiliated with KD Traders). Enjoy express delivery across Pakistan with Cash on Delivery and verified Bank Transfer.",
  applicationName: "MartInn",
  alternates: {
    canonical: siteUrl,
  },
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
    "MartInn",
    "KD Traders",
    "MartInn clothing",
    "MartInn streetwear",
    "streetwear Pakistan",
    "online clothing Karachi",
    "hoodies Pakistan",
    "oversized hoodies",
    "graphic tees Pakistan",
    "fine jewelry Pakistan",
    "cuban chains Karachi",
    "streetwear fashion brand",
    "cash on delivery clothing Pakistan",
    "fashion accessories",
  ],
  authors: [{ name: "MartInn (KD Traders)", url: siteUrl }],
  creator: "MartInn",
  publisher: "MartInn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MartInn | Modern Fashion, Streetwear & Jewelry",
    description:
      "Explore modern streetwear hoodies, graphic tees, fine jewelry, and accessories at MartInn (KD Traders). Free express delivery over PKR 8,000 nationwide.",
    url: siteUrl,
    siteName: "MartInn",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "MartInn - Modern Fashion, Streetwear & Jewelry",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MartInn | Modern Fashion, Streetwear & Jewelry",
    description:
      "Discover high-quality streetwear, fine jewelry, and everyday accessories at MartInn (KD Traders).",
    images: ["/icon-512x512.png"],
    creator: "@MartInn",
    site: "@MartInn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "MartInn (KD Traders)",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://www.instagram.com",
          "https://wa.me/923332244373",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+92-333-2244373",
          contactType: "customer service",
          areaServed: "PK",
          availableLanguage: ["English", "Urdu"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "MartInn",
        description: "Modern Fashion, Streetwear & Jewelry in Pakistan - KD Traders",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/products?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased">
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

