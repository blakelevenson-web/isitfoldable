import { db } from "./db";
import { shops, visits } from "./schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { seedIfEmpty } from "./seed";

let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    await seedIfEmpty();
    seeded = true;
  }
}

export async function getAllShops() {
  await ensureSeeded();
  return db.select().from(shops).orderBy(shops.name).all();
}

export async function getShopById(id: string) {
  await ensureSeeded();
  return db.select().from(shops).where(eq(shops.id, id)).get();
}

export async function getVisitsForShop(shopId: string) {
  await ensureSeeded();
  return db
    .select()
    .from(visits)
    .where(eq(visits.shopId, shopId))
    .orderBy(desc(visits.date))
    .all();
}

export async function getVisitById(id: string) {
  await ensureSeeded();
  return db
    .select({
      id: visits.id,
      shopId: visits.shopId,
      date: visits.date,
      sliceType: visits.sliceType,
      scoreOverall: visits.scoreOverall,
      scoreDough: visits.scoreDough,
      scoreSauce: visits.scoreSauce,
      scoreCheese: visits.scoreCheese,
      scoreFoldability: visits.scoreFoldability,
      comments: visits.comments,
      photoUrl: visits.photoUrl,
      shopName: shops.name,
      shopAddress: shops.address,
    })
    .from(visits)
    .innerJoin(shops, eq(visits.shopId, shops.id))
    .where(eq(visits.id, id))
    .get();
}

export async function getRecentVisits(limit = 3) {
  await ensureSeeded();
  return db
    .select({
      id: visits.id,
      date: visits.date,
      sliceType: visits.sliceType,
      scoreOverall: visits.scoreOverall,
      photoUrl: visits.photoUrl,
      comments: visits.comments,
      shopName: shops.name,
      shopId: visits.shopId,
      shopPhotoUrl: shops.photoUrl,
    })
    .from(visits)
    .innerJoin(shops, eq(visits.shopId, shops.id))
    .orderBy(desc(visits.date), desc(visits.createdAt))
    .limit(limit)
    .all();
}

export async function getElite8() {
  await ensureSeeded();
  return db
    .select({
      id: visits.id,
      date: visits.date,
      sliceType: visits.sliceType,
      scoreOverall: visits.scoreOverall,
      photoUrl: visits.photoUrl,
      shopName: shops.name,
      shopId: visits.shopId,
      shopPhotoUrl: shops.photoUrl,
    })
    .from(visits)
    .innerJoin(shops, eq(visits.shopId, shops.id))
    .orderBy(desc(visits.scoreOverall), desc(visits.date))
    .limit(8)
    .all();
}

export async function getStats() {
  await ensureSeeded();
  const totalShops = await db
    .select({ count: sql<number>`count(distinct ${shops.id})` })
    .from(shops)
    .get();
  const totalSlices = await db
    .select({ count: sql<number>`count(*)` })
    .from(visits)
    .get();
  return {
    totalShops: totalShops?.count ?? 0,
    totalSlices: totalSlices?.count ?? 0,
  };
}

export async function getSliceTypesForShop(shopId: string) {
  return db
    .select({
      sliceType: visits.sliceType,
      avgScore: sql<number>`round(avg(${visits.scoreOverall}), 1)`,
      count: sql<number>`count(*)`,
    })
    .from(visits)
    .where(eq(visits.shopId, shopId))
    .groupBy(visits.sliceType)
    .all();
}

export async function checkDuplicateShop(name: string, address: string) {
  return db
    .select()
    .from(shops)
    .where(
      and(
        sql`lower(trim(${shops.name})) = lower(trim(${name}))`,
        sql`lower(trim(${shops.address})) = lower(trim(${address}))`
      )
    )
    .get();
}

export async function createShop(data: {
  name: string;
  address: string;
  zipCode: string;
  photoUrl?: string;
}) {
  return db.insert(shops).values(data).returning().get();
}

export async function updateShop(id: string, data: {
  name?: string;
  address?: string;
  zipCode?: string;
  photoUrl?: string;
}) {
  return db.update(shops).set(data).where(eq(shops.id, id)).returning().get();
}

export async function deleteShop(id: string) {
  await db.delete(visits).where(eq(visits.shopId, id)).run();
  return db.delete(shops).where(eq(shops.id, id)).run();
}

export async function createVisit(data: {
  shopId: string;
  date: string;
  sliceType: string;
  scoreOverall: number;
  scoreDough: number;
  scoreSauce: number;
  scoreCheese: number;
  scoreFoldability: number;
  comments?: string;
  photoUrl?: string;
}) {
  return db.insert(visits).values(data).returning().get();
}

export async function updateVisit(id: string, data: {
  shopId?: string;
  date?: string;
  sliceType?: string;
  scoreOverall?: number;
  scoreDough?: number;
  scoreSauce?: number;
  scoreCheese?: number;
  scoreFoldability?: number;
  comments?: string;
  photoUrl?: string;
}) {
  return db.update(visits).set(data).where(eq(visits.id, id)).returning().get();
}

export async function deleteVisit(id: string) {
  return db.delete(visits).where(eq(visits.id, id)).run();
}

export async function searchVisits(query: string) {
  await ensureSeeded();
  const q = `%${query.toLowerCase()}%`;
  return db
    .select({
      id: visits.id,
      date: visits.date,
      sliceType: visits.sliceType,
      scoreOverall: visits.scoreOverall,
      scoreDough: visits.scoreDough,
      scoreSauce: visits.scoreSauce,
      scoreCheese: visits.scoreCheese,
      scoreFoldability: visits.scoreFoldability,
      comments: visits.comments,
      photoUrl: visits.photoUrl,
      shopName: shops.name,
      shopId: visits.shopId,
    })
    .from(visits)
    .innerJoin(shops, eq(visits.shopId, shops.id))
    .where(
      sql`lower(${shops.name}) like ${q} or ${shops.zipCode} like ${q} or lower(${visits.sliceType}) like ${q}`
    )
    .orderBy(desc(visits.scoreOverall))
    .all();
}
