import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";
import { pages, workspaces } from "~/db/schema";
import { archivePages } from "~/services/page.service";

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    coerce: { date: true },
  });

// PAGE
export const pageSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages).extend({
  id: z.string().uuid(),
  title: z
    .string()
    .optional()
    .transform((e) => e || "New Title"),
});
export const pageUpdateSchema = createUpdateSchema(pages).extend({
  id: z.string().uuid(),
});
export type PageInsert = z.infer<typeof pageInsertSchema>;
export type Page = z.infer<typeof pageSchema>;
export type PageUpdate = z.infer<typeof pageUpdateSchema>;

// PAGE TREE
export const uniqueUuidArraySchema = z
  .array(z.string().uuid())
  .refine((arr) => new Set(arr).size === arr?.length || arr == null, {
    message: "Array elements must be unique",
  });
const PageIndexSchema = z.union([z.string().uuid(), z.literal("root")]);
export const PageTreeItemSchema = z.object({
  data: z.string(),
  index: PageIndexSchema,
  canMove: z.boolean().optional(),
  canRename: z.boolean().optional(),
  children: uniqueUuidArraySchema.optional(),
  isFolder: z.boolean().optional(),
  isLoading: z.boolean().optional(),
});

export const PageTreeItemInsertSchema = PageTreeItemSchema.extend({
  index: PageIndexSchema,
}).omit({
  data: true,
});
export type PageTreeItem = z.infer<typeof PageTreeItemSchema>;
export type PageTreeInsertItem = z.infer<typeof PageTreeItemInsertSchema>;

export const pagesTreeSchema = z.record(PageIndexSchema, PageTreeItemSchema);
export const pageTreeInsertSchema = z.record(
  PageIndexSchema,
  PageTreeItemInsertSchema
);
export type PagesTree = z.infer<typeof pagesTreeSchema>;
export type PagesTreeInsert = z.infer<typeof pageTreeInsertSchema>;

// WORKSPACE
export const workspaceSchema = createSelectSchema(workspaces).extend({
  pages: pagesTreeSchema,
  archivedPages: pagesTreeSchema,
});

export const workspaceInsertSchema = createInsertSchema(workspaces).extend({
  pages: pagesTreeSchema,
  archivedPages: pagesTreeSchema,
});
export const workspaceUpdateSchema = createUpdateSchema(workspaces).extend({
  pages: pagesTreeSchema,
  id: z.string().uuid(),
});
export type WorkspaceInsert = z.infer<typeof workspaceInsertSchema>;
export type WorkspaceUpdate = z.infer<typeof workspaceUpdateSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
