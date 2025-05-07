import { jsonb, pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const yantaSchema = pgSchema("yanta");

// Define the pages table
export const pages = yantaSchema.table("pages", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastModified: timestamp("last_modified", { withTimezone: true })
    .defaultNow()
    .notNull(),
  modifiedBy: varchar("modified_by"), // Varchar, nullable
  title: varchar("title").default("New Title").notNull(),
  content: jsonb("content"),
  cover: varchar("cover"), // Varchar, nullable
  archivedOn: timestamp("archived_on", { withTimezone: true }),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  icon: varchar("icon"),
});

// Define the workspaces table
export const workspaces = yantaSchema.table("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar("name").default("New Workspace").notNull(), // Varchar, nullable
  pages: jsonb("pages").notNull().default({}), // JSONB, nullable
  createdBy: varchar("created_by").notNull(), // Varchar, nullable
  userId: varchar("user_id").notNull(),
  archivedPages: jsonb("archived_pages").notNull().default({}),
});
