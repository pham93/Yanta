import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { pagesTreeSchema } from "~/schemas/workspace.schema";
import {
  getWorkspaceWithPages,
  updateWorkspace,
} from "~/services/workspace.service";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { actionResponse } from "~/utils/actionResponse";

export async function loader({ params }: LoaderFunctionArgs) {
  const { workspace: workspaceId } = params;

  const getWorkspace$ = getWorkspaceWithPages(workspaceId as string);

  return actionResponse({
    data: {
      getWorkspace$,
    },
  });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { workspace: workspaceId } = params as { workspace: string };

  switch (request.method) {
    case "PUT": {
      const { pages: pagesStr } = (await request.json()) as { pages: string };
      const pages = pagesTreeSchema.parse(JSON.parse(pagesStr));
      await updateWorkspace({ id: workspaceId, pages });
      return true;
    }
  }
}

export default function Workspace() {
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
