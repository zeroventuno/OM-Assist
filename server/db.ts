import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema";

console.log("Initializing database connection...");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing!");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
} else {
  console.log("DATABASE_URL is present (length: " + process.env.DATABASE_URL.length + ")");
}

// For serverless environments like Vercel, we use max: 1 to avoid connection limits
const client = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

