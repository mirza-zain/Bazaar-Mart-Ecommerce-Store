import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString = (process.env.DATABASE_URL || "").trim();

/**
 * Whether a Neon connection string is available.
 *
 * Read-only storefront queries fall back to empty results when this is false,
 * so the site can render in environments without database credentials
 * (local previews, CI) instead of logging failed-query errors.
 */
export const isDatabaseConfigured = connectionString.length > 0;

if (!isDatabaseConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    "[MartInn] DATABASE_URL is not set. Database-backed content (products, categories, shipping) is disabled.\n" +
      "Add your Neon connection string to .env.local — see .env.example."
  );
}

const sql = neon(connectionString);

export const db = drizzle(sql);
