import { initDb } from "./db";

export async function seedIfEmpty() {
  await initDb();
}
