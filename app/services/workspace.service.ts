import { and, eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { workspaces } from "~/db/schema";
import {
  PagesTree,
  WorkspaceUpdate,
  type Workspace,
} from "~/schemas/workspace.schema";
import { createLogger } from "~/utils/logger";
import { tryCatch } from "~/utils/tryCatch";
import { getPagesByWorkspace } from "./page.service";
import { ROOT_NODE } from "~/utils/tree-control";

const logger = createLogger("Workspace Service");

export async function getWorkspace(workspaceId: string) {
  return db.query.workspaces
    .findFirst({
      where: and(
        eq(workspaces.userId, "John Doe"),
        eq(workspaces.id, workspaceId)
      ),
    })
    .then((e) => e as Workspace | undefined);
}

export async function getWorkspaceWithPages(workspaceId: string) {
  const retrieveWorkspace$ = getWorkspace(workspaceId);
  const retrievePages$ = getPagesByWorkspace(workspaceId);

  const { result, error } = await tryCatch(
    Promise.all([retrievePages$, retrieveWorkspace$]).then(
      ([pages, workspace]) => {
        if (!workspace) {
          return workspace;
        }

        const validPages: PagesTree = {
          root: workspace.pages["root"] ?? ROOT_NODE,
        };
        for (const page of pages) {
          if (workspace.pages[page.id]) {
            validPages[page.id] = workspace.pages[page.id];
            validPages[page.id].data = page.title;
          }
        }
        workspace.pages = validPages;
        console.log(validPages);
        return workspace;
      }
    )
  );
  if (error) {
    logger.error(error);
  } else if (!result) {
    logger.error(
      "There is no workspace with such name. Returning empty workspace"
    );
  } else {
    logger.debug(
      { workspace: result.name },
      "Successfully retreived workspace"
    );
  }

  return { result, error };
}

export async function updateWorkspace(workspace: WorkspaceUpdate) {
  await db
    .update(workspaces)
    .set(workspace)
    .where(eq(workspaces.id, workspace.id));
  logger.debug({ workspace: workspace.id }, "Successfully updated workspace");
  return true;
}

export type GetWorkspaceReturn = ReturnType<typeof getWorkspaceWithPages>;
