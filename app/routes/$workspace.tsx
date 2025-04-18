import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import { pageInsertSchema, pagesTreeSchema } from "~/schemas/workspace.schema";
import { upsertPage } from "~/services/page.service";
import {
  getWorkspace,
  updateWorkspacePages,
} from "~/services/workspace.service";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { actionResponse } from "~/utils/actionResponse";
import { tryCatch } from "~/utils/tryCatch";

export async function loader({ params }: LoaderFunctionArgs) {
  const { workspace: workspaceId } = params;

  const getWorkspace$ = getWorkspace(workspaceId as string);

  return actionResponse({
    data: {
      getWorkspace$,
    },
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { workspace: workspaceId } = params as { workspace: string };
  const { pages, page: pageStr } = (await request.json()) as {
    pages: string;
    page: string;
  };

  pagesTreeSchema.parse(JSON.parse(pages));
  const page = pageInsertSchema.parse(JSON.parse(pageStr));

  switch (request.method) {
    case "PUT": {
      await updateWorkspacePages(pages, workspaceId);
      await upsertPage({ ...page, workspaceId });
    }
  }
  return true;
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const { result, error } = await tryCatch(serverAction<typeof action>());
  if (error) {
    return { error: error.message };
  }
  return result;
}

export default function Page() {
  const { data } = useLoaderData<typeof loader>();
  const setWorkspaceAsync = useWorkspaceStore(
    (state) => state.setWorkspaceAsync
  );

  useEffect(() => {
    if (!data?.getWorkspace$) {
      return;
    }
    setWorkspaceAsync(data.getWorkspace$);
  }, [data, setWorkspaceAsync]);
  return <Outlet />;
}
