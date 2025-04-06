import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PersistenceState {
  sidebarExpanded: boolean;
}

interface PersistenceActions {
  setSidebarExpanded: () => void;
}

type PersistenceStore = PersistenceState & PersistenceActions;

const stateSlice: StateCreator<PersistenceStore> = (set) => ({
  sidebarExpanded: false,
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
