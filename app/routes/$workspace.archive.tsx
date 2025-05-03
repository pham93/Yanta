import { ActionFunctionArgs } from "@remix-run/node";
import { PagesTree, uniqueUuidArraySchema } from "~/schemas/workspace.schema";
import { deletePages, unarchivePage } from "~/services/page.service";
import { getWorkspace, updateWorkspace } from "~/services/workspace.service";
import { removeTreeItem } from "~/utils/tree-control";

export interface ArchiveAction {
  actionType: "remove" | "unarchive";
  pageId: string;
  newParent?: string;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { workspace: workspaceId } = params as { workspace: string };

  const payload = (await request.json()) as ArchiveAction;

  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    throw new Error("No workspace with this id");
  }

  const archivedPages = workspace.archivedPages;
  const pages = workspace.pages;

  const { newTree, removedItems } = removeTreeItem(
    { index: payload.pageId, data: "" },
    archivedPages
  );
  const ids = uniqueUuidArraySchema.parse(Object.keys(removedItems));
  workspace.archivedPages = newTree as PagesTree;

  switch (payload.actionType) {
    case "remove": {
      await Promise.allSettled([deletePages(ids), updateWorkspace(workspace)]);
      return true;
    }

    case "unarchive": {
      const parent = payload.newParent
        ? pages[payload.newParent]
        : pages["root"];

      if (!parent) {
        throw new Error("The operation cannot be completed without a parent");
      }

      const children = parent.children ?? [];
      children.push(payload.pageId);
      parent.children = children;

      workspace.pages = {
        ...workspace.pages,
        ...(removedItems as PagesTree),
      };

      await Promise.allSettled([
        unarchivePage(ids),
        updateWorkspace(workspace),
      ]);

      return true;
    }
  }
  return false;
}
