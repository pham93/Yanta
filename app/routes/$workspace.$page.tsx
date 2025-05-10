import { LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Alert } from "~/components/ui/alert";
import { Editor } from "~/components/ui/app/editor/editor";
import { SelectParent } from "~/components/ui/app/select-parent";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { EditorProvider } from "~/providers/editor.provider";
import { getPage } from "~/services/page.service";
import { createLogger } from "~/utils/logger";

const logger = createLogger("$PageId Route");

export async function loader({ params }: LoaderFunctionArgs) {
  const { workspace, page: pageId } = params;
  logger.debug({ pageId }, "Loading page");

  return { data$: getPage(pageId as string, workspace as string) };
}

const EditorSkeleton = () => {
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
  const { data$ } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Await resolve={data$}>
        {(data) =>
          data && (
            <EditorProvider initialValue={data}>
              {data.archivedOn && (
                <Alert
                  className="sticky z-20 bg-red-950 border-none rounded-none text-white flex justify-between items-center p-1 px-4"
                  variant={"destructive"}
                >
                  This page is archived
                  <SelectParent
                    page={{ data: data, index: data.id }}
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
            </EditorProvider>
          )
        }
      </Await>
    </Suspense>
  );
}
