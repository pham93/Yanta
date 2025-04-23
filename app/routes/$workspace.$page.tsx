import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { Editor } from "~/components/ui/app/editor/editor";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
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

const EditorSkeleton = ({ children }: React.PropsWithChildren) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout = -1;
    if (navigation.state === "loading") {
      timeout = window.setTimeout(() => setLoading(true), 200);
    } else {
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [navigation]);

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "mt-4 flex gap-5 w-full flex-col justify-center opacity-20 px-2"
      )}
    >
      <Skeleton className="h-60 rounded-none" />
      <Skeleton className="h-20 mx-20 rounded-none" />
      <Skeleton className="h-60 mx-20 rounded-none" />
    </div>
  );
};

export default function WorkspacePage() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <EditorProvider initialValue={data}>
      <EditorSkeleton>
        <Editor className="transition-[display] duration-200 delay-200 " />
      </EditorSkeleton>
    </EditorProvider>
  );
}
