import { create } from "zustand/react";
import {
  Workspace,
  PageTreeItem,
  PageTreeInsertItem,
  PagesTree,
  PageInsert,
} from "~/schemas/workspace.schema";
import { FetcherWithComponents } from "@remix-run/react";
import { GetWorkspaceReturn } from "~/services/workspace.service";

export interface WorkspaceState {
  workspace?: Workspace;
  isLoading: boolean;
}

interface WorkspacesAction {
  setWorkspace: (workspace: Workspace) => void;

  setWorkspaceAsync: (workspace$: GetWorkspaceReturn) => void;
  updatePage: (
    page: PageTreeItem,
    fetcher?: FetcherWithComponents<unknown>
  ) => void;
  submitWorkspace: (
    pagesTree: PagesTree,
    fetcher: FetcherWithComponents<unknown>
  ) => void;
  addNewPage: (
    pageTreeNode: PageTreeInsertItem,
    page: PageInsert,
    parent?: PageTreeItem,
    fetcher?: FetcherWithComponents<unknown>
  ) => Workspace;
}

export type WorkspacesStore = WorkspacesAction & WorkspaceState;

export const useWorkspaceStore = create<WorkspacesStore>((set, get) => ({
  isLoading: false,
  async setWorkspaceAsync(promise) {
    set({ isLoading: true });
    const { result } = await promise;
    set({ workspace: result, isLoading: false });
  },
  submitWorkspace(pagesTree, fetcher) {
    const { workspace: activeWorkspace } = get();
    if (!activeWorkspace) {
      throw new Error("No activew workspace");
    }
    fetcher.submit(
      {
        pages: JSON.stringify(pagesTree),
      },
      {
        action: `/${activeWorkspace.id}/page1`,
        method: "PUT",
        encType: "application/json",
      }
    );
  },

  updatePage(updatedPageTreeItem, fetcher) {
    const { workspace: activeWorkspace } = get();
    if (!activeWorkspace) {
      throw new Error("No activew workspace");
    }
    const pages = activeWorkspace.pages;
    const idx = updatedPageTreeItem.index as string;
    pages[idx] = { ...pages[idx], ...updatedPageTreeItem };

    fetcher && this.submitWorkspace(pages, fetcher);

    return { activeWorkspace: { ...activeWorkspace } };
  },

  addNewPage(pageTreeNode, page, parent, fetcher) {
    const { workspace: activeWorkspace } = get();
    if (!activeWorkspace) {
      throw new Error("No activew workspace");
    }
    const pageId = pageTreeNode.index as string;
    const pages = activeWorkspace.pages;
    if (!parent) {
      parent = pages["root"] as PageTreeItem;
    }
    const children = parent.children ?? [];

    parent.children = [...children, pageId];
    // add the new page to tree
    pages[pageId] = { ...pageTreeNode };

    const updatedWorkspace = { ...activeWorkspace, pages };
    set({ workspace: updatedWorkspace });

    if (fetcher) {
      fetcher.submit(
        {
          pages: JSON.stringify(pages),
          page: JSON.stringify(page),
        },
        {
          action: `/${activeWorkspace.id}`,
          method: "PUT",
          encType: "application/json",
        }
      );
    }
    return updatedWorkspace;
  },

  setWorkspace(workspace) {
    set({ workspace: workspace });
  },
}));
