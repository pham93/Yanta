import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";
import style from "./editor.module.css";
import * as Button from "../../button";
import * as Input from "../../input";
import * as Toggle from "../../toggle";

export default function Editor() {
  // Stores the document JSON.
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "heading",
        content: "This is a heading block",
      },
      {
        type: "paragraph",
        content: "This is a paragraph block",
      },
      {
        type: "paragraph",
      },
    ],
  });

  // Renders the editor instance and its document JSON.
  return (
    <>
      <BlockNoteView
        className={`editor ${style.editor} pb-24`}
        editor={editor}
        data-editor-theme="one"
        onChange={() => {
          // Saves the document JSON to state.
          setBlocks(editor.document);
        }}
      />
    </>
  );
}
