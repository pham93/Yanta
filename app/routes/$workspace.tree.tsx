import { ActionFunctionArgs } from "@remix-run/node";
import { ClientActionFunctionArgs } from "@remix-run/react";
import { z } from "zod";
import {
  PageInsert,
  pageInsertSchema,
  PagesTree,
  PageTreeItem,
  PageUpdate,
  pageUpdateSchema,
  uniqueUuidArraySchema,
  Workspace,
} from "~/schemas/workspace.schema";
import { archivePages, getPage, upsertPage } from "~/services/page.service";
import { getWorkspace, updateWorkspace } from "~/services/workspace.service";
import {
  addTreeItem,
  createDefaultRoot,
  removeTreeItem,
} from "~/utils/tree-control";
import { tryCatch } from "~/utils/tryCatch";

function removePageOptimistic(
  target: PageTreeItem,
  activeWorkspace: Workspace
) {
  const { newTree: pages, removedItems } = removeTreeItem(
    target,
    activeWorkspace.pages
  );

  const root = activeWorkspace.archivedPages["root"] ?? createDefaultRoot();
  root.children = root.children ?? [];
  root.children.push(target.index);

  activeWorkspace.archivedPages = {
    ...activeWorkspace.archivedPages,
    root,
    ...removedItems,
  };

  const updatedWorkspace = {
    ...activeWorkspace,
    pages: pages as PagesTree,
  };

  return { updatedWorkspace, removedItems };
}

function addPageOptimistic(
  page: PageInsert,
  workspace: Workspace,
  parentId?: string
) {
  const pages = workspace.pages;

  workspace.pages = addTreeItem(
    {
      data: page.title ?? "New Title",
      index: page.id,
      canMove: true,
      canRename: true,
      children: [],
      isFolder: true,
    },
    pages,
    pages[parentId ?? ""]
  ) as PagesTree;

  return { ...workspace };
}

function updatePage(activeWorkspace: Workspace, page: PageUpdate) {
  const pages = { ...activeWorkspace.pages };
  const pageId = page.id;
  const pageTreeItem = activeWorkspace.pages[pageId];
  pages[pageId] = { ...pages[pageId], ...pageTreeItem };

  activeWorkspace.pages = pages;

  return { ...activeWorkspace };
}

export const workspaceTree = {
  removePageOptimistic,
  addPageOptimistic,
  updatePage,
};

export async function action({ request, params }: ActionFunctionArgs) {
  const { workspace: workspaceId } = params as { workspace: string };

  switch (request.method) {
    // update page
    case "PUT": {
      const { page: pageStr } = (await request.json()) as {
        page: string;
      };
      const page = pageUpdateSchema.parse(JSON.parse(pageStr));

      const dbPage = await getPage(page.id, workspaceId);
      if (dbPage?.archivedOn) {
        throw new Error("Page is readonly");
      }

      const result = await getWorkspace(workspaceId);
      if (!result) {
        return false;
      }
      const updatedWorkspace = workspaceTree.updatePage(result, page);

      await Promise.allSettled([
        updateWorkspace(updatedWorkspace),
        upsertPage({ workspaceId, ...page }),
      ]);
      break;
    }

    // create new page
    case "POST": {
      const { page: pageStr, parentId } = (await request.json()) as {
        page: string;
        parentId?: string;
      };
      const page = pageInsertSchema.parse(JSON.parse(pageStr));

      const result = await getWorkspace(workspaceId);

      if (!result) {
        return false;
      }

      const updatedWorkspace = workspaceTree.addPageOptimistic(
        page,
        result,
        parentId
      );

      await Promise.allSettled([
        upsertPage({ ...page, workspaceId }),
        updateWorkspace(updatedWorkspace),
      ]);

      return true;
    }
    // archive page
    case "DELETE": {
      let { pageId } = (await request.json()) as { pageId: string };
      pageId = z.string().uuid().parse(pageId);

      const result = await getWorkspace(workspaceId);
      if (!result) {
        return false;
      }
      const pageTreeItem = result.pages[pageId];
      const { updatedWorkspace, removedItems } =
        workspaceTree.removePageOptimistic(pageTreeItem, result);
      const ids = uniqueUuidArraySchema.parse(Object.keys(removedItems));

      await Promise.allSettled([
        archivePages(ids),
        updateWorkspace(updatedWorkspace),
      ]);
      break;
    }
  }
  return true;
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const { result, error } = await tryCatch(serverAction<typeof action>());
  if (error) {
    return { error: error.message };
  }
  return result;
}
