// import React, { createContext, useContext, useRef } from "react";
// import { useStore } from "zustand";
// import {
//   createWorkspaceStore,
//   WorkspaceState,
//   WorkspacesStore,
//   WorkspaceStoreApi,
// } from "~/store/workspaces.store";

// const AppStoreContext = createContext<WorkspaceStoreApi | undefined>(undefined);

// export const WorkspaceProvider = ({
//   children,
//   initialValue,
// }: React.PropsWithChildren & { initialValue?: WorkspaceState }) => {
//   const storeRef = useRef<WorkspaceStoreApi>();

//   if (!storeRef.current) {
//     storeRef.current = createWorkspaceStore(initialValue);
//   }

//   return (
//     <AppStoreContext.Provider value={storeRef.current}>
//       {children}
//     </AppStoreContext.Provider>
//   );
// };

// export const useAppStore = () => {
//   const context = useContext(AppStoreContext);

//   if (!context) {
//     throw new Error("No appstore provider with workspace store");
//   }
//   return context;
// };

// export const useWorkspaceStore = <T,>(
//   selector: (store: WorkspacesStore) => T
// ) => {
//   const context = useContext(AppStoreContext);

//   if (!context) {
//     throw new Error("No appstore provider with workspace store");
//   }

//   return useStore(context, selector);
// };
