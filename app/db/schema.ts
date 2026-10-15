import { boolean, jsonb, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
  image?: string;
  variant?: string;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").notNull().default("Pending"), // 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentMethod: text("payment_method").notNull().default("cod"), // 'cod' | 'bank_transfer'
  paymentProof: text("payment_proof"), // screenshot image URL or base64
  paymentStatus: text("payment_status").notNull().default("Pending"), // 'Pending' | 'Verified' | 'Rejected'
  discountCode: text("discount_code"),
  discountAmount: numeric("discount_amount").default("0"),
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountPercent: numeric("discount_percent").notNull(),
  minOrderAmount: numeric("min_order_amount").default("0"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("Unread"), // 'Unread' | 'Replied' | 'Archived'
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type NewDiscountCode = typeof discountCodes.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
