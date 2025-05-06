import { StateCreator, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { cookieStorage } from "zustand-cookie-storage";
import React, { createContext, useContext, useRef } from "react";
import { UserPreferences } from "~/schemas/user-preferences.schema";

export type AppState = UserPreferences;

interface AppAction {
  toggleComment: () => void;
  toggleSidebar: () => void;
}

type AppStore = AppState & AppAction;

const appStateSlice: StateCreator<AppStore> = (set, get) => ({
  commentOpen: false,
  sidebarOpen: true,
  toggleComment() {
    const { commentOpened } = get();
    set({ commentOpened: !commentOpened });
  },
  toggleSidebar() {
    const { sidebarOpened } = get();
    set({ sidebarOpened: !sidebarOpened });
  },
});

export const createAppStore = (initialState: Partial<AppState>) =>
  createStore<AppStore>()(
    persist((...args) => ({ ...appStateSlice(...args), ...initialState }), {
      name: "yanta-app-preferences",
      storage: createJSONStorage(() => cookieStorage),
    })
  );

export type AppStoreApi = ReturnType<typeof createAppStore>;

const AppContext = createContext<AppStoreApi | undefined>(undefined);

export const AppProvider = ({
  children,
  initialValue,
}: React.PropsWithChildren & { initialValue: Partial<AppState> }) => {
  const storeRef = useRef<AppStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createAppStore(initialValue);
    console.log("current", storeRef.current);
  }

  return (
    <AppContext.Provider value={storeRef.current}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = <T,>(selector: (store: AppStore) => T) => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("No app provider");
  }

  return useStore(context, selector);
};
