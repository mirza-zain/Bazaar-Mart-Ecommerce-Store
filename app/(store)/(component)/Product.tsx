import Image from "next/image";
import Link from "next/link";
import { getStoreProducts } from "@/app/lib/actions/store";

type Prop = {
  limit?: number;
  category?: string;
};

export default async function Products({ limit, category }: Prop) {
  const products = await getStoreProducts({ limit, category });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {products.map((item) => (
          <Link
            href={`/products/${item.id}`}
            key={item.id}
            className="group flex flex-col gap-3"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/60 shadow-xs">
              <Image
                src={item.image || "/images/img1.jpg"}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              {Number(item.stock) <= 0 && (
                <div className="absolute top-3 left-3 bg-neutral-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  Out of Stock
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition truncate">
                {item.name}
              </h3>
              <div className="flex gap-2 text-xs text-neutral-400 uppercase mt-0.5">
                <span>{item.category}</span>
                <span>•</span>
                <span>{item.subCategory}</span>
              </div>
              <p className="font-semibold text-neutral-900 mt-1">
                PKR {Number(item.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
