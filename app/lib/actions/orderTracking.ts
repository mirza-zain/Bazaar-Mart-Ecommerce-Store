'use server';

import { db } from "@/app/lib/db";
import { orders, Order } from "@/app/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { ensureTablesExist } from "@/app/lib/actions/admin";

export async function trackOrderAction(query: string): Promise<Order | null> {
  try {
    await ensureTablesExist();
    const clean = query.trim();
    if (!clean) return null;

    const upperClean = clean.toUpperCase();

    // Check if query has prefix #ORD- or ORD-
    if (upperClean.startsWith("#ORD-") || upperClean.startsWith("ORD-")) {
      const numPart = upperClean.replace(/[^0-9]/g, "");
      const orderId = parseInt(numPart, 10);
      if (!isNaN(orderId)) {
        const byId = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
        if (byId.length > 0) return byId[0];
      }
    }

    // Purely numeric check (e.g. "12")
    if (/^\d+$/.test(clean) && clean.length < 8) {
      const orderId = parseInt(clean, 10);
      const byId = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      if (byId.length > 0) return byId[0];
    }

    // Look up by email (most recent order)
    if (clean.includes("@")) {
      const byEmail = await db
        .select()
        .from(orders)
        .where(sql`LOWER(${orders.customerEmail}) = LOWER(${clean})`)
        .orderBy(desc(orders.id))
        .limit(1);

      if (byEmail.length > 0) return byEmail[0];
    }

    // Look up by phone number
    const digitsOnly = clean.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7) {
      const byPhone = await db
        .select()
        .from(orders)
        .where(sql`REPLACE(REPLACE(${orders.phone}, '-', ''), ' ', '') LIKE ${`%${digitsOnly}%`}`)
        .orderBy(desc(orders.id))
        .limit(1);

      if (byPhone.length > 0) return byPhone[0];
    }

    return null;
  } catch (error) {
    console.error("Error tracking order:", error);
    return null;
  }
}

