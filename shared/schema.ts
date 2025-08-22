import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  carrier: text("carrier"),
  title: text("title"),
  status: text("status"),
  origin: text("origin"),
  destination: text("destination"),
  estimatedDelivery: timestamp("estimated_delivery"),
  lastUpdate: timestamp("last_update").defaultNow(),
  trackingData: jsonb("tracking_data"),
  isActive: boolean("is_active").default(true),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trackingEvents = pgTable("tracking_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").notNull(),
  status: text("status").notNull(),
  location: text("location"),
  description: text("description"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  trackingNumber: true,
  title: true,
  userId: true,
});

export const insertTrackingEventSchema = createInsertSchema(trackingEvents).pick({
  packageId: true,
  status: true,
  location: true,
  description: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
