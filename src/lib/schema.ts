import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const shops = sqliteTable("shops", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address").notNull(),
  zipCode: text("zip_code").notNull(),
  photoUrl: text("photo_url"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const visits = sqliteTable("visits", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  shopId: text("shop_id").notNull().references(() => shops.id),
  date: text("date").notNull(),
  sliceType: text("slice_type").notNull(),
  scoreOverall: integer("score_overall").notNull(),
  scoreDough: integer("score_dough").notNull(),
  scoreSauce: integer("score_sauce").notNull(),
  scoreCheese: integer("score_cheese").notNull(),
  scoreFoldability: integer("score_foldability").notNull(),
  comments: text("comments"),
  photoUrl: text("photo_url"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
