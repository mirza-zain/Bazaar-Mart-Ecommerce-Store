'use server';

import { db } from "@/app/lib/db";
import { orders, products, discountCodes, Order, Product, DiscountCode } from "@/app/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import { uploadToCloudinary, uploadFileAction } from "@/app/lib/cloudinary";

// Ensure tables exist on Neon if migrations haven't run yet
export async function ensureTablesExist() {
  await connection();
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
        phone TEXT,
        address TEXT,
        city TEXT,
        total_amount NUMERIC NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        payment_method TEXT NOT NULL DEFAULT 'cod',
        payment_proof TEXT,
        payment_status TEXT NOT NULL DEFAULT 'Pending',
        discount_code TEXT,
        discount_amount NUMERIC DEFAULT '0',
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS discount_codes (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        discount_percent NUMERIC NOT NULL,
        min_order_amount NUMERIC DEFAULT '0',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Unread',
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
    
    // Cloudinary image upload handling
    const imageInput = (formData.get("image") as string) || "";
    let finalImageUrl = imageInput.trim() || "/images/img1.jpg";

    const imageFile = formData.get("imageFile") as File | null;
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      const uploadRes = await uploadFileAction(formData);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    } else if (imageInput && imageInput.startsWith("data:image/")) {
      const uploadRes = await uploadToCloudinary(imageInput, "bazzario/products");
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    }

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
      image: finalImageUrl,
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

export async function verifyPaymentAction(orderId: number, paymentStatus: "Verified" | "Rejected") {
  try {
    await ensureTablesExist();
    const updateData: { paymentStatus: string; status?: string } = { paymentStatus };
    if (paymentStatus === "Verified") {
      updateData.status = "Processing";
    }
    await db.update(orders).set(updateData).where(eq(orders.id, orderId));
    revalidatePath("/admin");
    revalidatePath("/admin/manageOrders");
    return { success: true };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error: "Failed to update payment status." };
  }
}

export async function getDiscountCodesAction(): Promise<DiscountCode[]> {
  await connection();
  try {
    await ensureTablesExist();
    return await db.select().from(discountCodes).orderBy(desc(discountCodes.id));
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    return [];
  }
}

export async function createDiscountCodeAction(formData: FormData) {
  try {
    await ensureTablesExist();
    const code = (formData.get("code") as string)?.trim().toUpperCase();
    const discountPercent = formData.get("discountPercent") as string;
    const minOrderAmount = (formData.get("minOrderAmount") as string) || "0";

    if (!code || !discountPercent) {
      return { success: false, error: "Code and discount percentage are required." };
    }

    await db.insert(discountCodes).values({
      code,
      discountPercent: discountPercent.toString(),
      minOrderAmount: minOrderAmount.toString(),
      isActive: true,
    });

    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error creating discount code:", error);
    return { success: false, error: "Failed to create discount code (code may already exist)." };
  }
}

export async function deleteDiscountCodeAction(id: number) {
  try {
    await ensureTablesExist();
    await db.delete(discountCodes).where(eq(discountCodes.id, id));
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error deleting discount code:", error);
    return { success: false, error: "Failed to delete discount code." };
  }
}


