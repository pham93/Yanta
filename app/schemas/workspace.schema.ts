import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";
import { pages, workspaces } from "~/db/schema";

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  coerce: { date: true },
});

export const pageSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages);

export const PageTreeItemSchema = z.object({
  data: z.string().optional(),
  index: z.union([z.string().uuid(), z.number(), z.literal("root")]),
  canMove: z.boolean().optional(),
  canRename: z.boolean().optional(),
  children: z
    .array(z.string().uuid())
    .optional()
    .refine((arr) => new Set(arr).size === arr?.length || arr == null, {
      message: "Array elements must be unique",
    }),
  isFolder: z.boolean().optional(),
});

export const PageTreeItemInsertSchema = PageTreeItemSchema.extend({
  index: z.union([z.string().uuid(), z.number(), z.literal("root")]),
  data: z.string().optional(),
});

export const pagesTreeSchema = z.record(z.string(), PageTreeItemSchema);
export type PagesTree = z.infer<typeof pagesTreeSchema>;
export type PageInsert = z.infer<typeof pageInsertSchema>;
export type Page = z.infer<typeof pageSchema>;
export type PageTreeItem = z.infer<typeof PageTreeItemSchema>;
export type PageTreeInsertItem = z.infer<typeof PageTreeItemInsertSchema>;

export const workspaceSchema = createSelectSchema(workspaces).extend({
  pages: pagesTreeSchema,
});

export const workspaceInsertSchema = createInsertSchema(workspaces).extend({
  pages: pagesTreeSchema,
});

export type WorkspaceInsert = z.infer<typeof workspaceInsertSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
