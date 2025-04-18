import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import React, { useRef, useState } from "react";
import style from "./editor.module.css";
import CoverImage from "./cover-image";
import { ClientOnly } from "remix-utils/client-only";
import { cn } from "~/lib/utils";
import { useEditorStore } from "~/providers/editor.provider";

export function EditorContent() {
  // Stores the document JSON.
  //
  const updateEditor = useEditorStore((state) => state.update);

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
  });

  // Rendersthe editor instance and its document JSON.
  return (
    <BlockNoteView
      className={`editor ${style.editor} pb-24`}
      editor={editor}
      data-editor-theme="one"
      onChange={() => {
        // Saves the document JSON to state.
        updateEditor({ content: editor.document });
      }}
    />
  );
}

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Title = () => {
  const title = useEditorStore((state) => state.title);
  const updateEditor = useEditorStore((state) => state.update);
  return (
    <input
      type="text"
      value={title}
      name="title"
      contentEditable
      maxLength={100}
      placeholder="New Title"
      onChange={(e) => updateEditor({ title: e.target.value })}
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
}: React.ComponentProps<"form">) => {
  const ref = useRef<HTMLFormElement>(null);

  const [content] = useState("");

  return (
    <form
      className={cn("content overflow-auto flex flex-col", className)}
      {...props}
      ref={ref}
    >
      <CoverImage />
      <div className="editor-container mx-20">
        <Title />
        <ClientOnly
          fallback={
            <textarea
              name="content"
              className="w-full bg-transparent"
              defaultValue={content}
            />
          }
        >
          {() => <EditorContent />}
        </ClientOnly>
      </div>
    </form>
  );
};
