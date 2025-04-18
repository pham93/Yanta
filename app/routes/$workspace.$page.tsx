import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Editor } from "~/components/ui/app/editor/editor";
import { Skeleton } from "~/components/ui/skeleton";
import { EditorProvider } from "~/providers/editor.provider";
import { getPage } from "~/services/page.service";
import { createLogger } from "~/utils/logger";
import { tryCatch } from "~/utils/tryCatch";

const logger = createLogger("$PageId Route");

export async function loader({ params }: LoaderFunctionArgs) {
  const { workspace, page: pageId } = params;

  const { result, error } = await tryCatch(
    getPage(pageId as string, workspace as string)
  );

  if (error) {
    logger.error(error);
  }

  return {
    data: result ?? {
      coverImage: "",
      content: [],
      title: "",
    },
  };
}

export function ErrorBoundary() {
  return <h1>No!</h1>;
}

const EditorSkeleton = () => {
  return (
    <div className="flex gap-5 w-full flex-col justify-center delay-300 animate-[opacity]">
      <Skeleton className="h-60 rounded-none" />
      <Skeleton className="h-20 mx-20 rounded-none" />
      <Skeleton className="h-60 mx-20 rounded-none" />
    </div>
  );
};

export default function WorkspacePage() {
  const { data } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <EditorProvider initialValue={data}>
      {navigation.state === "loading" ? (
        <EditorSkeleton />
      ) : (
        <Editor className="transition-[display] duration-200 delay-200 " />
      )}
    </EditorProvider>
  );
}
