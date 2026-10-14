import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import dns from "node:dns"
import ws from "ws"

dns.setDefaultResultOrder("ipv4first")

neonConfig.webSocketConstructor = ws

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export const db = drizzle({
    client: pool
})