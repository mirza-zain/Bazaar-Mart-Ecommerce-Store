'use server';

import { db } from "@/app/lib/db";
import { orders, OrderItem, Order } from "@/app/db/schema";
import { ensureTablesExist } from "@/app/lib/actions/admin";
import { revalidatePath } from "next/cache";

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  totalAmount: number;
  items: OrderItem[];
};

export type CreateOrderResult = {
  success: boolean;
  orderId?: number;
  error?: string;
};

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    await ensureTablesExist();

    if (!input.customerName || !input.customerEmail || !input.address) {
      return { success: false, error: "Please fill out all required shipping details." };
    }

    const inserted = await db
      .insert(orders)
      .values({
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        totalAmount: input.totalAmount.toString(),
        status: "Pending",
        items: input.items,
      })
      .returning({ id: orders.id });

    revalidatePath("/admin");
    revalidatePath("/admin/manageOrders");

    return {
      success: true,
      orderId: inserted[0]?.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}

