import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { Alert } from "~/components/ui/alert";
import { Editor } from "~/components/ui/app/editor/editor";
import Header from "~/components/ui/app/header";
import { SelectParent } from "~/components/ui/app/select-parent";
import { Button } from "~/components/ui/button";
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

  if (!result) {
    throw redirect("/home");
  }

  return { data: result };
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
        {data.archivedOn && (
          <Alert
            className="sticky z-20 bg-red-950 border-none rounded-none text-white flex justify-between items-center p-1 px-4"
            variant={"destructive"}
          >
            This page is archived
            <SelectParent
              page={{ data: data.title, index: data.id }}
              renderTriggerButton={() => (
                <Button
                  className="text-green-500 font-medium"
                  variant={"outline"}
                  size={"sm"}
                >
                  Unarchived
                </Button>
              )}
            ></SelectParent>
          </Alert>
        )}
        <Editor className="transition-[display] duration-200 delay-200 " />
      </EditorSkeleton>
    </EditorProvider>
  );
}
