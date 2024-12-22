import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  mediaUrls: jsonb("media_urls").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const childrenRelations = relations(children, ({ one, many }) => ({
  user: one(users, {
    fields: [children.userId],
    references: [users.id],
  }),
  achievements: many(achievements),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  child: one(children, {
    fields: [achievements.childId],
    references: [children.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertChildSchema = createInsertSchema(children)
  .extend({
    dateOfBirth: z.string().nullable().transform(val => {
      if (!val) return null;
      return new Date(val);
    }),
  });
export const selectChildSchema = createSelectSchema(children);
export const insertAchievementSchema = createInsertSchema(achievements)
  .extend({
    date: z.string().transform(val => new Date(val)),
    mediaUrls: z.array(z.string()).nullable(),
    tags: z.array(z.string()).nullable(),
  });
export const selectAchievementSchema = createSelectSchema(achievements);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Child = typeof children.$inferSelect;
export type InsertChild = typeof children.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
