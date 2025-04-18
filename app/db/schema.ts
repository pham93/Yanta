import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Define the pages table
export const pages = pgTable("pages", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  modifiedBy: varchar("modified_by"), // Varchar, nullable
  title: varchar("title").default("New Title").notNull(), // Varchar, nullable
  content: jsonb("content"),
  cover: varchar("cover"), // Varchar, nullable
  workspaceId: uuid("workspace_id").notNull(), // UUID, nullable, default gen_random_uuid()
});

// Define the workspaces table
export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar("name").default("New Workspace").notNull(), // Varchar, nullable
  pages: jsonb("pages"), // JSONB, nullable
  createdBy: varchar("created_by").notNull(), // Varchar, nullable
  userId: varchar("user_id").notNull(),
});
