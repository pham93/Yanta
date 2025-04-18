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

export async function getPage(pageId: string, workspaceId: string) {
  const page = await db.query.pages.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, pageId), eq(fields.workspaceId, workspaceId)),
  });
  if (page) {
    logger.info({ pageId: page.id }, "Successfully retrieved");
  }
  return page;
}
