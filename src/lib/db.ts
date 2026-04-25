import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./data/foldable.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Initialize tables
export async function initDb() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS shops (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      photo_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id),
      date TEXT NOT NULL,
      slice_type TEXT NOT NULL,
      score_overall REAL NOT NULL CHECK(score_overall BETWEEN 1 AND 5),
      score_dough REAL NOT NULL CHECK(score_dough BETWEEN 1 AND 5),
      score_sauce REAL NOT NULL CHECK(score_sauce BETWEEN 1 AND 5),
      score_cheese REAL NOT NULL CHECK(score_cheese BETWEEN 1 AND 5),
      score_foldability REAL NOT NULL CHECK(score_foldability BETWEEN 1 AND 5),
      comments TEXT,
      photo_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}
