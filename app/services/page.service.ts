import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import { pages } from "~/db/schema";
import { PageInsert } from "~/schemas/workspace.schema";
import { createLogger } from "~/utils/logger";

const logger = createLogger("PageService");

export async function upsertPage(page: PageInsert) {
  await db
    .insert(pages)
    .values(page)
    .onConflictDoUpdate({ target: pages.id, set: page });

  logger.info({ pageId: page.id }, "Successully upsert page");
}

export async function archivePages(ids: string[]) {
  await db
    .update(pages)
    .set({
      archivedOn: sql`NOW()`,
    })
    .where(inArray(pages.id, ids));

  logger.info({ ids }, "Successfully archived pages");
}

export async function deletePages(ids: string[]) {
  await db.delete(pages).where(inArray(pages.id, ids));
}

export async function unarchivePage(ids: string[]) {
  await db
    .update(pages)
    .set({ archivedOn: null })
    .where(inArray(pages.id, ids));
}

export async function getPagesByWorkspace(workspaceId: string) {
  return db.query.pages.findMany({
    where: and(eq(pages.workspaceId, workspaceId), isNull(pages.archivedOn)),
  });
}

export async function getPage(pageId: string, workspaceId: string) {
  const page = await db.query.pages.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, pageId), eq(fields.workspaceId, workspaceId)),
  });
  if (page) {
    logger.info({ pageId: page.id }, "Successfully retrieved page");
  }
  return page;
}
