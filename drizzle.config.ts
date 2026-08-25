import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/schema.ts",
  out: "./drizzle",
  driver: process.env.DATABASE_URL?.startsWith("postgres") ? undefined : "pglite",
  dbCredentials: { url: process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL ?? "./data/darsflow-pg" },
});
