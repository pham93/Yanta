import { and, eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { pages, workspaces } from "~/db/schema";
import { PagesTree, type Workspace } from "~/schemas/workspace.schema";
import { createLogger } from "~/utils/logger";
import { tryCatch } from "~/utils/tryCatch";

const logger = createLogger("Workspace Service");

export async function getWorkspace(workspaceId: string) {
  const retrieveWorkspace$ = db.query.workspaces
    .findFirst({
      where: and(
        eq(workspaces.userId, "John Doe"),
        eq(workspaces.id, workspaceId)
      ),
    })
    .then((e) => e as Workspace);

  const retrievePages$ = db.query.pages.findMany({
    where: eq(pages.workspaceId, workspaceId),
  });

  const { result, error } = await tryCatch(
    Promise.all([retrievePages$, retrieveWorkspace$]).then(
      ([pages, workspace]) => {
        const validPages: PagesTree = {
          root: workspace.pages["root"] ?? { index: "root", data: "" },
        };
        for (const page of pages) {
          if (workspace.pages[page.id]) {
            validPages[page.id] = workspace.pages[page.id];
            validPages[page.id].data = page.title;
          }
        }
        workspace.pages = validPages;
        return workspace;
      }
    )
  );
  if (error) {
    logger.error(error);
  } else {
    logger.debug({ name: result.name }, "Successfully retrieved workspace");
  }

  return { result, error };
}

export async function updateWorkspacePages(pages: string, workspaceId: string) {
  await db
    .update(workspaces)
    .set({
      pages,
    })
    .where(eq(workspaces.id, workspaceId));

  return true;
}

export type GetWorkspaceReturn = ReturnType<typeof getWorkspace>;
