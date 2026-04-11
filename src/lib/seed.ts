import { db, initDb } from "./db";
import { shops, visits } from "./schema";
import { sql } from "drizzle-orm";

export async function seedIfEmpty() {
  await initDb();

  const shopCount = await db.select({ count: sql<number>`count(*)` }).from(shops).get();
  if (shopCount && shopCount.count > 0) return;

  // Seed shops
  await db.insert(shops).values({
    id: "s1",
    name: "Luigi's Classic Slices",
    address: "123 Dough St, New York, NY 10012",
    zipCode: "10012",
    photoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
  }).run();

  await db.insert(shops).values({
    id: "s2",
    name: "Crusty Corner",
    address: "456 Oven Ave, Brooklyn, NY 11211",
    zipCode: "11211",
    photoUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800",
  }).run();

  await db.insert(shops).values({
    id: "s3",
    name: "Fold & Hold",
    address: "789 Cheesy Blvd, Queens, NY 11101",
    zipCode: "11101",
    photoUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800",
  }).run();

  // Seed visits
  await db.insert(visits).values({
    id: "r1",
    shopId: "s1",
    date: "2023-10-15",
    sliceType: "New York",
    scoreOverall: 5,
    scoreDough: 5,
    scoreSauce: 5,
    scoreCheese: 5,
    scoreFoldability: 5,
    comments: "The absolute classic fold. No flop.",
    photoUrl: "https://images.unsplash.com/photo-1574126154517-d1e0d89e7344?auto=format&fit=crop&q=80&w=800",
  }).run();

  await db.insert(visits).values({
    id: "r2",
    shopId: "s1",
    date: "2023-10-20",
    sliceType: "New York",
    scoreOverall: 5,
    scoreDough: 4,
    scoreSauce: 5,
    scoreCheese: 4,
    scoreFoldability: 5,
    comments: "Greasy in a good way.",
    photoUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800",
  }).run();

  await db.insert(visits).values({
    id: "r3",
    shopId: "s2",
    date: "2023-11-01",
    sliceType: "Grandma",
    scoreOverall: 4,
    scoreDough: 3,
    scoreSauce: 4,
    scoreCheese: 3,
    scoreFoldability: 1,
    comments: "Too thick to fold, but tasty sauce.",
    photoUrl: "https://images.unsplash.com/photo-1564128442383-9201fcc740eb?auto=format&fit=crop&q=80&w=800",
  }).run();

  await db.insert(visits).values({
    id: "r4",
    shopId: "s3",
    date: "2023-11-05",
    sliceType: "New York",
    scoreOverall: 4,
    scoreDough: 5,
    scoreSauce: 3,
    scoreCheese: 5,
    scoreFoldability: 4,
    comments: "Garlic hit is intense.",
    photoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
  }).run();
}
