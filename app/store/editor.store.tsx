import { Block } from "@blocknote/core";
import { createStore } from "zustand";
import { PageInsert } from "~/schemas/workspace.schema";

export interface EditorState extends Partial<PageInsert> {
  cover?: string | null;
  content?: Block[];
  title: string;
}

interface EditorAction {
  update: (state: Partial<EditorState>) => void;
}

export type EditorStore = EditorState & EditorAction;

export const createEditorStore = (initialState: Partial<EditorState> = {}) =>
  createStore<EditorStore>((set) => ({
    title: "",
    ...initialState,
    update(state) {
      set(state);
    },
  }));

export type EditorStoreApi = ReturnType<typeof createEditorStore>;
