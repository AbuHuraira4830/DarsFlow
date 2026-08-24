import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "../src/server/db";

migrate(db, { migrationsFolder: "./drizzle" });
console.log("DarsFlow database migrations applied.");
