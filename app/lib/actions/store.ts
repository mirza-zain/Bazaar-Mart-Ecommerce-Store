import { db } from "@/app/lib/db";
import { products, Product, orders, Order } from "@/app/db/schema";
import { desc, eq, or, sql } from "drizzle-orm";
import { ensureTablesExist } from "@/app/lib/actions/admin";

export const fallbackDemoProducts: Product[] = [
  {
    id: 1,
    name: "Essential Oversized Hoodie",
    description: "Premium heavyweight fleece hoodie with dropped shoulders and kangaroo pocket.",
    category: "Clothing",
    subCategory: "Hoodie",
    price: "4500",
    stock: "45",
    image: "/images/img1.jpg",
    variants: [
      { label: "S", price: 4500, stock: 15 },
      { label: "M", price: 4500, stock: 20 },
      { label: "L", price: 4500, stock: 10 },
    ],
  },
  {
    id: 2,
    name: "Boxy Streetwear Tee",
    description: "240 GSM combed cotton vintage wash crewneck t-shirt.",
    category: "Clothing",
    subCategory: "T-Shirt",
    price: "2200",
    stock: "60",
    image: "/images/img2.jpg",
    variants: [],
  },
  {
    id: 3,
    name: "Cuban Link Silver Chain",
    description: "Handcrafted 925 sterling silver plated 8mm Cuban link necklace.",
    category: "Jewelry",
    subCategory: "Necklaces",
    price: "3500",
    stock: "8",
    image: "/images/img3.jpg",
    variants: [],
  },
  {
    id: 4,
    name: "Retro Acetate Sunglasses",
    description: "UV400 polarized square sunglasses with handcrafted tortoise acetate frames.",
    category: "Accessories",
    subCategory: "Eyewear",
    price: "2800",
    stock: "25",
    image: "/images/img4.jpg",
    variants: [],
  },
  {
    id: 5,
    name: "Structured Denim Overshirt",
    description: "Washed raw denim overshirt with relaxed utilitarian dual chest pockets.",
    category: "Clothing",
    subCategory: "Jackets",
    price: "6800",
    stock: "14",
    image: "/images/img1.jpg",
    variants: [],
  },
  {
    id: 6,
    name: "Signet Minimalist Ring",
    description: "Solid stainless steel geometric signet ring with brushed matte finish.",
    category: "Jewelry",
    subCategory: "Rings",
    price: "1900",
    stock: "30",
    image: "/images/img3.jpg",
    variants: [],
  },
];

export type StoreFilterOptions = {
  category?: string;
  subCategory?: string;
  search?: string;
  sort?: string;
  limit?: number;
};

export async function getStoreProducts(
  options?: StoreFilterOptions
): Promise<Product[]> {
  try {
    await ensureTablesExist();

    const dbProducts = await db.select().from(products).orderBy(desc(products.id));
    let items = dbProducts.length > 0 ? dbProducts : fallbackDemoProducts;

    // Filter by Category
    if (options?.category && options.category.toLowerCase() !== "all") {
      items = items.filter(
        (p) => p.category.toLowerCase() === options.category!.toLowerCase()
      );
    }

    // Filter by Sub-Category
    if (options?.subCategory && options.subCategory.toLowerCase() !== "all") {
      items = items.filter(
        (p) => p.subCategory.toLowerCase() === options.subCategory!.toLowerCase()
      );
    }

    // Search query
    if (options?.search && options.search.trim() !== "") {
      const q = options.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      );
    }

    // Sort
    if (options?.sort) {
      if (options.sort === "price-asc") {
        items.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (options.sort === "price-desc") {
        items.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (options.sort === "name-asc") {
        items.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    // Limit
    if (options?.limit && options.limit > 0) {
      items = items.slice(0, options.limit);
    }

    return items;
  } catch (error) {
    console.error("Error fetching store products:", error);
    let items = fallbackDemoProducts;
    if (options?.category && options.category.toLowerCase() !== "all") {
      items = items.filter(
        (p) => p.category.toLowerCase() === options.category!.toLowerCase()
      );
    }
    if (options?.subCategory && options.subCategory.toLowerCase() !== "all") {
      items = items.filter(
        (p) => p.subCategory.toLowerCase() === options.subCategory!.toLowerCase()
      );
    }
    if (options?.limit && options.limit > 0) {
      items = items.slice(0, options.limit);
    }
    return items;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    await ensureTablesExist();
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (result.length > 0) return result[0];

    const fallback = fallbackDemoProducts.find((p) => p.id === id);
    return fallback || null;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    const fallback = fallbackDemoProducts.find((p) => p.id === id);
    return fallback || null;
  }
}
