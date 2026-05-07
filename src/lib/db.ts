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
      score_overall REAL NOT NULL,
      score_dough REAL NOT NULL,
      score_sauce REAL NOT NULL,
      score_cheese REAL NOT NULL,
      score_foldability REAL NOT NULL,
      comments TEXT,
      photo_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Migrate: drop CHECK constraints from visits table if they exist
  try {
    const tableInfo = await client.execute(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='visits'`
    );
    const createSql = tableInfo.rows[0]?.sql as string | undefined;
    if (createSql && createSql.includes("CHECK")) {
      await client.executeMultiple(`
        ALTER TABLE visits RENAME TO visits_old;

        CREATE TABLE visits (
          id TEXT PRIMARY KEY,
          shop_id TEXT NOT NULL REFERENCES shops(id),
          date TEXT NOT NULL,
          slice_type TEXT NOT NULL,
          score_overall REAL NOT NULL,
          score_dough REAL NOT NULL,
          score_sauce REAL NOT NULL,
          score_cheese REAL NOT NULL,
          score_foldability REAL NOT NULL,
          comments TEXT,
          photo_url TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        );

        INSERT INTO visits SELECT * FROM visits_old;

        DROP TABLE visits_old;
      `);
      console.log("Migrated visits table: removed CHECK constraints");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  }
}
