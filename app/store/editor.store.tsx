import { Block } from "@blocknote/core";
import { createStore } from "zustand";
import usePersistenceStore from "~/hooks/use-persistence-store";
import { PageInsert } from "~/schemas/workspace.schema";

export interface EditorState extends Partial<PageInsert> {
  cover?: string | null;
  content?: Block[];
  title: string;
  lastModified: Date;
}

interface EditorAction {
  update: (state: Partial<EditorState>) => void;
  getState: () => EditorStore;
}

export type EditorStore = EditorState & EditorAction;

export const createEditorStore = (initialState: Partial<EditorState> = {}) =>
  createStore<EditorStore>((set, get) => ({
    title: "",
    lastModified: new Date(),
    ...initialState,

    getState: get,
    setState: set,
    update(state) {
      const { id } = get();
      const { localChanges } = usePersistenceStore.getState();
      const page = {
        ...localChanges[id as string],
        ...state,
        lastModified: new Date(),
      };

      usePersistenceStore.setState({
        localChanges: {
          ...localChanges,
          [id as string]: page,
        },
      });
      set({ ...state });
    },
  }));

export type EditorStoreApi = ReturnType<typeof createEditorStore>;
