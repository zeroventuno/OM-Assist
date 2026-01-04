import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

console.log("Initializing database connection...");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing!");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL.trim();
console.log("DATABASE_URL is present (length: " + databaseUrl.length + ")");

// For serverless environments like Vercel, we use max: 1 to avoid connection limits
const client = postgres(databaseUrl, {
  ssl: 'require',
  max: 1,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
