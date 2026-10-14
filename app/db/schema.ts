import { jsonb, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type ProductVariant = {
  label: string;
  price: number;
  stock: number;
};

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subCategory: text("subCategory").notNull(),
  price: numeric("price").notNull(),
  stock: numeric("stock").notNull(),
  image: text("image"),
  variants: jsonb("variants").$type<ProductVariant[]>().notNull().default([]),
});

export type OrderItem = {
  productId: number;
  name: string;
  quantity: number;
  price: number;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").notNull().default("Pending"), // 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
