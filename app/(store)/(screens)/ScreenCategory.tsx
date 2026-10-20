import { Cpu, Home, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ScreenCategory() {
  const items = [
    {
      id: 1,
      category: "Smart Gadgets",
      href: "/products?category=Accessories",
      icon: <Cpu className="w-6 h-6" />
    },
    {
      id: 2,
      category: "Home & Kitchen",
      href: "/products?category=Accessories",
      icon: <Home className="w-6 h-6" />
    },
    {
      id: 3, 
      category: "Utility & Essentials",
      href: "/products",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  return (
    <div className="w-full px-5 py-16 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl md:text-5xl font-medium tracking-wider text-center">Explore Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-5xl">
        {items.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-center gap-4 py-8 px-6 bg-slate-100 rounded-xl border border-slate-200 hover:bg-black hover:text-white transition-all duration-300 ease-in-out text-xl font-medium text-center"
          >
            {item.icon}
            <span>{item.category}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
