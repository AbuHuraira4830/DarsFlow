import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL?.trim();
const hosted = Boolean(url?.startsWith("postgres://") || url?.startsWith("postgresql://"));
const globalDatabase = globalThis as typeof globalThis & { darsflowPglite?: PGlite; darsflowPostgres?: ReturnType<typeof postgres> };
const pglite = hosted ? undefined : (globalDatabase.darsflowPglite ??= new PGlite(url?.replace(/^pglite:/, "") || "./data/darsflow-pg"));
const postgresClient = hosted ? (globalDatabase.darsflowPostgres ??= postgres(url!, { max: 5, prepare: false })) : undefined;

export const db = hosted ? drizzlePostgres(postgresClient!, { schema }) : drizzlePglite(pglite!, { schema });
export const databaseMode = hosted ? "postgres" : "pglite";
export async function closeDatabase() {
  if (postgresClient) await postgresClient.end();
  if (pglite) await pglite.close();
  delete globalDatabase.darsflowPostgres;
  delete globalDatabase.darsflowPglite;
}
