import { create } from "zustand/react";
import {
  Workspace,
  PageTreeItem,
  PageInsert,
  PageUpdate,
} from "~/schemas/workspace.schema";
import { Fetcher, FetcherWithComponents } from "@remix-run/react";
import { GetWorkspaceReturn } from "~/services/workspace.service";
import { workspaceTree } from "~/routes/$workspace.tree";
import { StateCreator } from "zustand";
import { ArchiveAction } from "~/routes/$workspace.archive";

export interface WorkspaceState {
  workspace?: Workspace;
  isLoading: boolean;
}

interface WorkspacesAction {
  setWorkspace: (workspace: Workspace) => void;

  setWorkspaceAsync: (workspace$: GetWorkspaceReturn) => void;
  removePage: (
    page: PageTreeItem,
    fetcher?: FetcherWithComponents<unknown>
  ) => void;
  updatePage: (
    page: PageUpdate,
    fetcher?: FetcherWithComponents<unknown>
  ) => void;
  addPage: (
    page: PageInsert,
    parent?: PageTreeItem,
    fetcher?: FetcherWithComponents<unknown>
  ) => Workspace;
  archiveAction: (
    action: ArchiveAction,
    fetcher?: FetcherWithComponents<unknown>
  ) => void;
}

export type WorkspacesStore = WorkspacesAction & WorkspaceState;

function submitWorkspace(
  get: () => WorkspacesStore,
  payload: Record<string, string>,
  method: Fetcher["formMethod"],
  fetcher: FetcherWithComponents<unknown>
) {
  const { workspace: activeWorkspace } = get();
  if (!activeWorkspace) {
    throw new Error("No active workspace");
  }
  fetcher.submit(payload, {
    action: `/${activeWorkspace.id}/tree`,
    method: method,
    encType: "application/json",
  });
}

const stateSlice: StateCreator<WorkspacesStore> = (set, get) => ({
  isLoading: true,

  archiveAction(action, fetcher) {
    const { workspace: activeWorkspace } = get();
    if (!activeWorkspace) {
      throw new Error("No active workspace");
    }
    const { actionType, pageId, newParent } = action;

    activeWorkspace.archivedPages[pageId].isLoading = true;
    set({ workspace: { ...activeWorkspace } });

    const payload: typeof action = {
      actionType,
      pageId,
      newParent,
    };

    fetcher?.submit(
      { ...payload },
      {
        action: `/${activeWorkspace.id}/archive`,
        method: "PUT",
        encType: "application/json",
      }
    );
  },

  setWorkspace(workspace) {
    set({ workspace: workspace });
  },

  async setWorkspaceAsync(promise) {
    set({ isLoading: true });
    const { result } = await promise;
    set({ workspace: result, isLoading: false });
  },

  removePage(pageTreeItem, fetcher) {
    const { workspace: activeWorkspace } = get();
    if (!activeWorkspace) {
      throw new Error("No active workspace");
    }

    const newWorkspace = { ...activeWorkspace };
    newWorkspace.pages[pageTreeItem.index].isLoading = true;

    set({ workspace: newWorkspace });

    if (fetcher) {
      submitWorkspace(
        get,
        {
          pageId: pageTreeItem.index,
        },
        "DELETE",
        fetcher
      );
    }
  },

  updatePage(page, fetcher) {
    const { workspace: activeWorkspace } = get();
    if (!activeWorkspace) {
      throw new Error("No active workspace");
    }

    const updatedWorkspace = workspaceTree.updatePage(activeWorkspace, page);

    updatedWorkspace.pages[page.id].isLoading = !!fetcher;
    const data = updatedWorkspace.pages[page.id].data;
    updatedWorkspace.pages[page.id].data = {
      ...data,
      ...page,
    };

    set({ workspace: { ...updatedWorkspace } });

    if (fetcher) {
      submitWorkspace(
        get,
        {
          page: JSON.stringify(page),
        },
        "PUT",
        fetcher
      );
    }
  },

  addPage(page, parent, fetcher) {
    const { workspace: activeWorkspace } = get();

    if (!activeWorkspace || !page.id) {
      throw new Error("No active workspace or page id is not provided");
    }

    const newWorkspace = workspaceTree.addPageOptimistic(
      page,
      activeWorkspace,
      parent?.index
    );
    newWorkspace.pages[page.id].isLoading = true;

    set({ workspace: newWorkspace });

    if (fetcher) {
      submitWorkspace(
        get,
        {
          page: JSON.stringify(page),
          parentId: parent?.index ?? "",
        },
        "POST",
        fetcher
      );
    }
    return activeWorkspace;
  },
});

// export const useWorkspaceStore = create<WorkspacesStore>()(
//   persist(stateSlice, {
//     name: "yanta-workspace",
//     storage: createJSONStorage(() => localStorage),
//   })
// );
export const useWorkspaceStore = create<WorkspacesStore>(stateSlice);
