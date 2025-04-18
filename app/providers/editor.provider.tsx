import React, { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";
import {
  createEditorStore,
  EditorState,
  EditorStore,
  EditorStoreApi,
} from "~/store/editor.store";

const EditorContext = createContext<EditorStoreApi | undefined>(undefined);

export const EditorProvider = ({
  children,
  initialValue,
  store,
}: React.PropsWithChildren & {
  initialValue?: EditorState;
  store?: EditorStoreApi;
}) => {
  const storeRef = useRef<EditorStoreApi>();

  if (!storeRef.current) {
    storeRef.current = store ?? createEditorStore(initialValue);
  }

  useEffect(() => {
    initialValue && storeRef.current?.setState(initialValue);
  }, [initialValue]);

  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorStore = <T,>(selector: (store: EditorStore) => T) => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("No editor provider with workspace store");
  }
  return useStore(context, selector);
};

export const useEditorSnapshot = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("No editor provider with workspace store");
  }
  return context;
};
