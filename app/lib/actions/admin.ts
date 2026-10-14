'use server';

import { db } from "@/app/lib/db";
import { orders, products, Order, Product } from "@/app/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Ensure tables exist on Neon if migrations haven't run yet
export async function ensureTablesExist() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        "subCategory" TEXT NOT NULL,
        price NUMERIC NOT NULL,
        stock NUMERIC NOT NULL,
        image TEXT,
        variants JSONB NOT NULL DEFAULT '[]'::jsonb
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        total_amount NUMERIC NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

export type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
};

export type DashboardData = {
  stats: DashboardStats;
  recentProducts: Product[];
  recentOrders: Order[];
};

export async function getDashboardData(): Promise<DashboardData> {
  await ensureTablesExist();

  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.id));
    const allOrders = await db.select().from(orders).orderBy(desc(orders.id));

    const totalRevenue = allOrders.reduce((sum, order) => {
      return sum + (Number(order.totalAmount) || 0);
    }, 0);

    const lowStockCount = allProducts.filter((p) => Number(p.stock) < 10).length;

    return {
      stats: {
        totalProducts: allProducts.length,
        totalOrders: allOrders.length,
        totalRevenue,
        lowStockCount,
      },
      recentProducts: allProducts.slice(0, 10),
      recentOrders: allOrders.slice(0, 10),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockCount: 0,
      },
      recentProducts: [],
      recentOrders: [],
    };
  }
}

export async function addProductAction(formData: FormData) {
  try {
    await ensureTablesExist();

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "No description provided.";
    const category = formData.get("category") as string;
    const subCategory = (formData.get("subCategory") as string) || "General";
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const image = (formData.get("image") as string) || "/images/img1.jpg";

    if (!name || !price || !category) {
      return { success: false, error: "Name, price, and category are required." };
    }

    await db.insert(products).values({
      name,
      description,
      category,
      subCategory,
      price: price.toString(),
      stock: (stock || "10").toString(),
      image,
      variants: [],
    });

    revalidatePath("/admin");
    revalidatePath("/admin/manageProducts");
    return { success: true };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product." };
  }
}

export async function deleteProductAction(productId: number) {
  try {
    await ensureTablesExist();
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin");
    revalidatePath("/admin/manageProducts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product." };
  }
}

export async function updateOrderStatusAction(orderId: number, status: string) {
  try {
    await ensureTablesExist();
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    revalidatePath("/admin");
    revalidatePath("/admin/manageOrders");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status." };
  }
}

export async function seedDemoDataAction() {
  try {
    await ensureTablesExist();

    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length === 0) {
      // Seed initial products
      const demoProducts = [
        {
          name: "Essential Hoodie",
          description: "Premium fleece oversized streetwear hoodie with minimal branding.",
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
          name: "Boxy Streetwear Tee",
          description: "Heavyweight 240 GSM dropped shoulder crewneck t-shirt.",
          category: "Clothing",
          subCategory: "T-Shirt",
          price: "2200",
          stock: "60",
          image: "/images/img2.jpg",
          variants: [],
        },
        {
          name: "Cuban Link Silver Chain",
          description: "Handcrafted 925 sterling silver plated 8mm Cuban link chain.",
          category: "Jewelry",
          subCategory: "Necklaces",
          price: "3500",
          stock: "8", // Low stock demo
          image: "/images/img3.jpg",
          variants: [],
        },
        {
          name: "Retro Acetate Sunglasses",
          description: "Vintage inspired UV400 polarized square sunglasses with tortoise frame.",
          category: "Accessories",
          subCategory: "Eyewear",
          price: "2800",
          stock: "25",
          image: "/images/img4.jpg",
          variants: [],
        },
        {
          name: "Structured Denim Overshirt",
          description: "Washed raw denim jacket with relaxed utilitarian workwear pockets.",
          category: "Clothing",
          subCategory: "Jackets",
          price: "6800",
          stock: "14",
          image: "/images/img1.jpg",
          variants: [],
        },
      ];

      for (const p of demoProducts) {
        await db.insert(products).values(p);
      }
    }

    const existingOrders = await db.select().from(orders).limit(1);
    if (existingOrders.length === 0) {
      // Seed sample orders
      const demoOrders = [
        {
          customerName: "Ahmad Khan",
          customerEmail: "ahmad.k@gmail.com",
          totalAmount: "9000",
          status: "Delivered",
          items: [
            { productId: 1, name: "Essential Hoodie", quantity: 2, price: 4500 },
          ],
        },
        {
          customerName: "Sara Bilal",
          customerEmail: "sara.b@hotmail.com",
          totalAmount: "5700",
          status: "Processing",
          items: [
            { productId: 2, name: "Boxy Streetwear Tee", quantity: 1, price: 2200 },
            { productId: 3, name: "Cuban Link Silver Chain", quantity: 1, price: 3500 },
          ],
        },
        {
          customerName: "Zainab Tariq",
          customerEmail: "zainab.t@yahoo.com",
          totalAmount: "2800",
          status: "Pending",
          items: [
            { productId: 4, name: "Retro Acetate Sunglasses", quantity: 1, price: 2800 },
          ],
        },
      ];

      for (const o of demoOrders) {
        await db.insert(orders).values(o);
      }
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error seeding demo data:", error);
    return { success: false, error: "Failed to seed demo data." };
  }
}
