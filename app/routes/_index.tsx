import type { MetaFunction } from "@remix-run/node";
import Editor from "~/components/ui/app/editor/editor";
import { ClientOnly } from "remix-utils/client-only";
import CoverImage from "~/components/ui/app/editor/cover-image";

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
    <div className="content overflow-auto">
      <CoverImage />
      <ClientOnly fallback={<textarea />}>{() => <Editor />}</ClientOnly>
    </div>
  );
}
