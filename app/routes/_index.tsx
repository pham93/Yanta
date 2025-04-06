import type { MetaFunction } from "@remix-run/node";
import Editor from "~/components/ui/app/editor/editor";
import { ClientOnly } from "remix-utils/client-only";
import CoverImage from "~/components/ui/app/editor/cover-image";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Yanta" },
    {
      name: "Yet Another Notetaking App",
      content: "Yet Another Notetaking App",
    },
  ];
};

export default function Index() {
  return (
    <div className="content overflow-auto flex flex-col">
      <CoverImage />
      <div className="mx-40">
        <input
          type="text"
          contentEditable
          maxLength={100}
          placeholder="New Title"
          className={cn(
            "whitespace-pre-wrap break-words text-[3rem] font-semibold outline-none resize-none",
            "w-full bg-transparent py-6"
          )}
        />
        <ClientOnly fallback={<textarea className="w-full bg-transparent" />}>
          {() => <Editor />}
        </ClientOnly>
      </div>
    </div>
  );
}
