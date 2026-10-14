'use server';

import { db } from "@/app/lib/db";
import { orders, Order } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureTablesExist } from "@/app/lib/actions/admin";

export async function trackOrderAction(query: string): Promise<Order | null> {
  try {
    await ensureTablesExist();
    const clean = query.trim();
    if (!clean) return null;

    // Check if query is formatted as #ORD-0001 or just 1
    const numericMatch = clean.replace(/[^0-9]/g, "");
    const orderId = numericMatch ? parseInt(numericMatch, 10) : null;

    if (orderId) {
      const byId = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      if (byId.length > 0) return byId[0];
    }

    // Look up by email
    const byEmail = await db
      .select()
      .from(orders)
      .where(sql`LOWER(${orders.customerEmail}) = LOWER(${clean})`)
      .limit(1);

    if (byEmail.length > 0) return byEmail[0];

    return null;
  } catch (error) {
    console.error("Error tracking order:", error);
    return null;
  }
}

