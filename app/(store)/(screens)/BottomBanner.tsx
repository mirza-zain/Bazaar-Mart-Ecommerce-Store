import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BottomBanner() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 md:my-16">
      <div className="w-full bg-slate-100 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-4 sm:gap-6 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-tight">
            Style That Moves With You
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-medium tracking-wide max-w-md">
            Modern Fashion for a Brighter Tomorrow
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-black text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-neutral-800 transition-all duration-300 shadow-sm"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Image Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Image
            src="/images/bottombanner.png"
            alt="Modern fashion banner"
            width={800}
            height={500}
            className="w-full max-w-sm sm:max-w-md md:max-w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
