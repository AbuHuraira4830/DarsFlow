import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const configuredPath = process.env.DATABASE_URL ?? "./data/darsflow.db";
const databasePath = resolve(/* turbopackIgnore: true */ process.cwd(), configuredPath.replace(/^file:/, ""));
mkdirSync(dirname(databasePath), { recursive: true });

const client = new Database(databasePath);
client.pragma("foreign_keys = ON");
client.pragma("journal_mode = WAL");

export const db = drizzle(client, { schema });
export { client as sqlite };
