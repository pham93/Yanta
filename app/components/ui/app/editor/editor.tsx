import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import React, { ChangeEvent, useEffect, useRef } from "react";
import style from "./editor.module.css";
import CoverImage from "./cover-image";
import { ClientOnly } from "remix-utils/client-only";
import { cn } from "~/lib/utils";
import { useEditorStore } from "~/providers/editor.provider";
import { useWorkspaceStore } from "~/store/workspaces.store";

export function EditorContent() {
  // Stores the document JSON.
  //
  const updateEditor = useEditorStore((state) => state.update);
  const content = useEditorStore((state) => state.content);

  const eventSource = useRef<"onChange" | "none">("none");
  // check local storage if there is a local version
  //

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: content ?? [
      {
        type: "paragraph",
        content: "",
      },
    ],
  });

  useEffect(() => {
    if (eventSource.current === "onChange") {
      eventSource.current = "none";
      return;
    }
    editor.replaceBlocks(editor.document, content ?? []);
  }, [content, editor]);

  // Rendersthe editor instance and its document JSON.
  return (
    <BlockNoteView
      className={`editor ${style.editor} pb-24`}
      editor={editor}
      data-editor-theme="one"
      onChange={() => {
        // Saves the document JSON to state.
        updateEditor({ content: editor.document });
        eventSource.current = "onChange";
      }}
    />
  );
}

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Title = () => {
  const title = useEditorStore((state) => state.title);
  const updateEditor = useEditorStore((state) => state.update);
  const getEditorSnapshot = useEditorStore((state) => state.getState);
  const updatePage = useWorkspaceStore((state) => state.updatePage);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const editorSnapshot = getEditorSnapshot();
    updateEditor({ title: e.target.value });
    // update the title on workspace tree if the page exist. This is optimistic, no update to backend
    if (editorSnapshot.id) {
      updatePage({ data: e.target.value, index: editorSnapshot.id }, {});
    }
  };

  return (
    <input
      type="text"
      value={title}
      name="title"
      contentEditable
      maxLength={100}
      placeholder="New Title"
      onChange={handleOnChange}
      className={cn(
        "whitespace-pre-wrap break-words text-[3rem] font-semibold outline-none resize-none pl-12",
        "w-full bg-transparent py-6"
      )}
    />
  );
};

export const Editor = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("content overflow-auto flex flex-col", className)}
      {...props}
    >
      <CoverImage />
      <div className="editor-container mx-20">
        <Title />
        <ClientOnly
          fallback={
            <textarea name="content" className="w-full bg-transparent" />
          }
        >
          {() => <EditorContent />}
        </ClientOnly>
      </div>
    </div>
  );
};
