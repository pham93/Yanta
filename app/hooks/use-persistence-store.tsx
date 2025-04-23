import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EditorState } from "~/store/editor.store";

interface PersistenceState {
  sidebarExpanded: boolean;
  localChanges: Record<string, Partial<EditorState>>;
}

interface PersistenceActions {
  setSidebarExpanded: () => void;
}

type PersistenceStore = PersistenceState & PersistenceActions;

const stateSlice: StateCreator<PersistenceStore> = (set) => ({
  sidebarExpanded: false,
  localChanges: {},

  setSidebarExpanded() {
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded }));
  },
});

const usePersistenceStore = create<PersistenceStore>()(
  persist(stateSlice, {
    name: "yanta-storage",
    storage: createJSONStorage(() => localStorage),
  })
);

export default usePersistenceStore;
export type { PersistenceState, PersistenceActions, PersistenceStore };
