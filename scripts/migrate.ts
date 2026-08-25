import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
if (url?.startsWith("postgres")) {
  const client = postgres(url, { max: 1 });
  await migratePostgres(drizzlePostgres(client), { migrationsFolder: "./drizzle" });
  await client.end();
} else {
  const client = new PGlite(url?.replace(/^pglite:/, "") || "./data/darsflow-pg");
  await migratePglite(drizzlePglite(client), { migrationsFolder: "./drizzle" });
  await client.close();
}
console.log("DarsFlow PostgreSQL migrations applied.");
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "Migration failed."); process.exitCode = 1; });
