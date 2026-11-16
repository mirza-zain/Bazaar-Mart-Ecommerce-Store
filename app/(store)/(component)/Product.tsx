import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getStoreProducts } from "@/app/lib/actions/store";
import { formatSubCategoryLabel } from "@/app/lib/format";

type Prop = {
  limit?: number;
  category?: string;
};

export default async function Products({ limit, category }: Prop) {
  const products = await getStoreProducts({ limit, category });

  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
        <p className="text-sm font-medium text-neutral-500">
          No products available right now. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((item) => {
        const isOutOfStock = Number(item.stock) <= 0;

        return (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className={`group flex flex-col gap-3 ${isOutOfStock ? "opacity-75" : ""}`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-100 shadow-xs">
              <Image
                src={item.image || "/images/img1.jpg"}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {isOutOfStock ? (
                <div className="absolute left-2.5 top-2.5 rounded-lg bg-neutral-900/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-xs sm:left-3 sm:top-3 sm:px-2.5 sm:text-[11px]">
                  Out of Stock
                </div>
              ) : (
                <div className="absolute left-2.5 top-2.5 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-800 backdrop-blur-xs sm:left-3 sm:top-3 sm:px-2.5 sm:text-[11px]">
                  In Stock
                </div>
              )}

              <div className="absolute inset-x-3 bottom-3 hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">
                <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2.5 text-xs font-bold text-black shadow-md backdrop-blur-xs">
                  <span>View Product</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-neutral-900 transition group-hover:text-neutral-600 sm:text-base">
                {item.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] uppercase tracking-wide text-neutral-400 sm:text-[11px]">
                <span className="truncate">{item.category}</span>
                {item.subCategory && (
                  <>
                    <span>•</span>
                    <span className="truncate">{formatSubCategoryLabel(item.subCategory)}</span>
                  </>
                )}
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-neutral-900 sm:text-base">
                  PKR {Number(item.price).toLocaleString()}
                </p>
                {item.variants && item.variants.length > 0 && (
                  <span className="shrink-0 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                    {item.variants.length} options
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
