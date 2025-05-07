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
import { useFetcher } from "@remix-run/react";
import { IconEmojiPicker } from "./page-icon";

export function EditorContent({ disabled }: { disabled?: boolean }) {
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
      editable={!disabled}
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

const Title = ({ disabled }: { disabled?: boolean }) => {
  const title = useEditorStore((state) => state.title);
  const updateEditor = useEditorStore((state) => state.update);
  const getEditorSnapshot = useEditorStore((state) => state.getState);
  const updatePage = useWorkspaceStore((state) => state.updatePage);
  const fetcher = useFetcher();

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    f?: typeof fetcher
  ) => {
    const editorSnapshot = getEditorSnapshot();
    updateEditor({ title: e.target.value });
    // update to the backend will be done after onBlur
    if (editorSnapshot.id) {
      updatePage({ title: e.target.value, id: editorSnapshot.id }, f);
    }
  };

  return (
    <input
      type="text"
      value={title}
      disabled={disabled}
      name="title"
      contentEditable
      maxLength={100}
      placeholder="New Title"
      onChange={(e) => handleOnChange(e)}
      onBlur={(e) => handleOnChange(e, fetcher)}
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
  const disabled = useEditorStore((state) => state.archivedOn != null);

  return (
    <div
      className={cn("content overflow-auto flex flex-col relative", className)}
      {...props}
    >
      <CoverImage disabled={disabled} />
      <div className="editor-container mx-20 relative">
        <IconEmojiPicker
          className="absolute -top-11 left-10 z-10"
          disabled={disabled}
        />
        <Title disabled={disabled} />
        <ClientOnly
          fallback={
            <textarea name="content" className="w-full bg-transparent" />
          }
        >
          {() => <EditorContent disabled={disabled} />}
        </ClientOnly>
      </div>
    </div>
  );
};
