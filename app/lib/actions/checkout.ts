'use server';

import { db } from "@/app/lib/db";
import { orders, discountCodes, OrderItem } from "@/app/db/schema";
import { ensureTablesExist } from "@/app/lib/actions/admin";
import { uploadToCloudinary } from "@/app/lib/cloudinary";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  totalAmount: number;
  items: OrderItem[];
  paymentMethod: "cod" | "bank_transfer";
  paymentProof?: string;
  discountCode?: string;
  discountAmount?: number;
};

export type CreateOrderResult = {
  success: boolean;
  orderId?: number;
  error?: string;
};

export type ValidateDiscountResult = {
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discountAmount?: number;
  error?: string;
};

export async function validateDiscountCodeAction(
  code: string,
  subtotal: number
): Promise<ValidateDiscountResult> {
  try {
    await ensureTablesExist();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, error: "Please enter a discount code." };
    }

    const matches = await db
      .select()
      .from(discountCodes)
      .where(sql`UPPER(${discountCodes.code}) = ${cleanCode} AND ${discountCodes.isActive} = true`)
      .limit(1);

    if (matches.length === 0) {
      // Fallback default promo code if not in DB yet
      if (cleanCode === "BAZAAR10") {
        const percent = 10;
        const discountAmount = Math.round((subtotal * percent) / 100);
        return {
          valid: true,
          code: "BAZAAR10",
          discountPercent: percent,
          discountAmount,
        };
      }
      return { valid: false, error: "Invalid or expired discount code." };
    }

    const rule = matches[0];
    const minOrder = Number(rule.minOrderAmount) || 0;
    if (subtotal < minOrder) {
      return {
        valid: false,
        error: `This code requires a minimum order amount of PKR ${minOrder.toLocaleString()}.`,
      };
    }

    const percent = Number(rule.discountPercent);
    const discountAmount = Math.round((subtotal * percent) / 100);

    return {
      valid: true,
      code: rule.code,
      discountPercent: percent,
      discountAmount,
    };
  } catch (error) {
    console.error("Error validating discount code:", error);
    return { valid: false, error: "Failed to validate discount code." };
  }
}

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    await ensureTablesExist();

    if (!input.customerName || !input.customerEmail || !input.address) {
      return { success: false, error: "Please fill out all required shipping details." };
    }

    if (input.paymentMethod === "cod" && input.city.trim().toLowerCase() !== "karachi") {
      return {
        success: false,
        error: "Cash on Delivery is currently only available for deliveries within Karachi. Please select Bank Transfer.",
      };
    }

    if (input.paymentMethod === "bank_transfer" && !input.paymentProof) {
      return {
        success: false,
        error: "Please upload a screenshot of your bank transfer receipt.",
      };
    }

    const paymentStatus = input.paymentMethod === "bank_transfer" ? "Pending Verification" : "Pending";

    let finalPaymentProof = input.paymentProof || null;
    if (finalPaymentProof && finalPaymentProof.startsWith("data:image/")) {
      const uploadRes = await uploadToCloudinary(finalPaymentProof, "bazzario/payments");
      if (uploadRes.success && uploadRes.url) {
        finalPaymentProof = uploadRes.url;
      }
    }

    const inserted = await db
      .insert(orders)
      .values({
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        phone: input.phone,
        address: input.address,
        city: input.city,
        totalAmount: input.totalAmount.toString(),
        status: "Pending",
        paymentMethod: input.paymentMethod,
        paymentProof: finalPaymentProof,
        paymentStatus,
        discountCode: input.discountCode || null,
        discountAmount: (input.discountAmount || 0).toString(),
        items: input.items,
      })
      .returning({ id: orders.id });

    // Deduct stock from inventory for purchased products
    if (input.items && input.items.length > 0) {
      for (const item of input.items) {
        if (item.productId && item.quantity > 0) {
          try {
            await db.execute(sql`
              UPDATE products
              SET stock = GREATEST(0, stock::numeric - ${item.quantity})
              WHERE id = ${item.productId}
            `);
          } catch (stockErr) {
            console.error(`Failed to update stock for product ${item.productId}:`, stockErr);
          }
        }
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/manageOrders");
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");

    return {
      success: true,
      orderId: inserted[0]?.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}

