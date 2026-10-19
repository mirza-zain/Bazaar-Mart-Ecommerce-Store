import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Check, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import { getProductById } from "@/app/lib/actions/store";
import { getProductReviews } from "@/app/lib/actions/reviews";
import ProductPurchaseActions from "./(components)/ProductPurchaseActions";
import ProductReviewsSection from "./(components)/ProductReviewsSection";

interface Props {
  params: Promise<{ id: string }>;
}

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);
  if (isNaN(productId)) return { title: "Product Not Found" };

  const product = await getProductById(productId);
  if (!product) return { title: "Product Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://me2one.vercel.app";
  const productUrl = `${siteUrl}/products/${product.id}`;

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | MartInn`,
      description: product.description.slice(0, 160),
      url: productUrl,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | MartInn`,
      description: product.description.slice(0, 160),
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const reviewsSummary = await getProductReviews(productId);

  const inStock = Number(product.stock) > 0;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://me2one.vercel.app";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image || `${siteUrl}/images/img1.jpg`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "MartInn (KD Traders)",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: "PKR",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "MartInn",
      },
    },
    ...(reviewsSummary.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewsSummary.averageRating.toFixed(1),
            reviewCount: reviewsSummary.totalReviews,
          },
        }
      : {}),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 md:px-12 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Image Gallery */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs">
          <Image
            src={product.image || "/images/img1.jpg"}
            alt={product.name}
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Product Info & Purchase Form */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.subCategory}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mt-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(reviewsSummary.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-900">
                {reviewsSummary.totalReviews > 0 ? reviewsSummary.averageRating.toFixed(1) : "5.0"}
              </span>
              <span className="text-xs text-neutral-400">
                ({reviewsSummary.totalReviews}{" "}
                {reviewsSummary.totalReviews === 1 ? "verified review" : "verified reviews"})
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
              PKR {Number(product.price).toLocaleString()}
            </p>
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                inStock
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  inStock ? "bg-emerald-600" : "bg-rose-600"
                }`}
              />
              {inStock ? "In Stock & Ready to Ship" : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <div className="border-t border-b border-neutral-200 py-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">About the product</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Purchase Actions (Variant, Quantity, Add to Bag, Buy Now) */}
          <ProductPurchaseActions
            productId={product.id}
            name={product.name}
            category={product.category}
            price={Number(product.price)}
            stock={Number(product.stock)}
            image={product.image || "/images/img1.jpg"}
            variants={product.variants || []}
          />

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-neutral-100 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-black shrink-0" />
              <span>Free delivery over PKR 8,000</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-black shrink-0" />
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
              <span>100% genuine product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Customer Reviews Section */}
      <ProductReviewsSection
        productId={product.id}
        productName={product.name}
        summary={reviewsSummary}
      />
    </div>
  );
}

