import { db } from "@/app/lib/db";
import { products, Product } from "@/app/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureTablesExist } from "@/app/lib/actions/admin";
import { connection } from "next/server";

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
  await connection();
  try {
    await ensureTablesExist();

    const dbProducts = await db.select().from(products).orderBy(desc(products.id));
    let items = dbProducts;

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
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  await connection();
  try {
    await ensureTablesExist();
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (result.length > 0) return result[0];
    return null;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}
