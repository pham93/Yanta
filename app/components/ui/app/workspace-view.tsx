import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar";
import AddNewPageDialog from "./new-page-dialog";
import { ContextMenu, ContextMenuTrigger } from "../context-menu";
import { Link, useFetcher, useParams } from "@remix-run/react";
import { DropdownMenu, DropdownMenuTrigger } from "../dropdown-menu";
import { Button } from "../button";
import { MoreVertical } from "lucide-react";
import SettingsMenu from "./settings-menu";
import { ControlledTreeEnvironment, Tree } from "../tree";
import { TreeItem, TreeItemIndex } from "react-complex-tree";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { Skeleton } from "../skeleton";
import { PageTreeItem } from "~/schemas/workspace.schema";

export function WorkspaceView() {
  const updatePage = useWorkspaceStore((state) => state.updatePage);
  const { workspace: workspaceId } = useParams();
  const fetcher = useFetcher();

  const workspace = useWorkspaceStore((state) => state.workspace);

  const isLoading = useWorkspaceStore(
    (state) => state.isLoading && workspaceId
  );

  if (!workspace) {
    return (
      <>
        {isLoading ? (
          <div className="w-full px-2">
            <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
            <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
            <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
            <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
            <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
          </div>
        ) : null}
      </>
    );
  }

  const handleRename = (
    pageTreeItem: TreeItem<PageTreeItem["data"]>,
    name: string
  ) => {
    pageTreeItem.data = { ...pageTreeItem.data, title: name };
    updatePage({ id: pageTreeItem.index as string, title: name }, fetcher);
  };

  const handleOnTreeChange = (
    newTree: Record<TreeItemIndex, TreeItem<PageTreeItem["data"]>>
  ) => {
    fetcher.submit(
      {
        pages: JSON.stringify(newTree),
      },
      {
        action: `/${workspace.id}`,
        method: "PUT",
        encType: "application/json",
      }
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem className="dark:text-gray-300 text-gray-800 whitespace-nowrap">
          <span className="flex flex-row justify-between items-center group">
            {workspace.name}
            <AddNewPageDialog />
          </span>
        </SidebarMenuItem>
        <ControlledTreeEnvironment<PageTreeItem["data"]>
          items={workspace.pages}
          viewState={{}}
          renderDepthOffset={10}
          className="mt-0"
          getItemTitle={(item) => item.data.title ?? "New Title"}
          canDragAndDrop={true}
          onTreeOrderChange={handleOnTreeChange}
          onRenameItem={handleRename}
          canReorderItems={true}
          canDropOnFolder={true}
          canDropOnNonFolder={false}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={false}
          renderItemTitle={({ title, item, context }) => {
            return (
              <ContextMenu>
                <span className="group flex items-center justify-between w-11/12">
                  <ContextMenuTrigger asChild>
                    <Link
                      className="text-left flex-shrink text-ellipsis flex-grow overflow-hidden"
                      to={`/${workspace.id}/${item.index}`}
                    >
                      {title || "New Title"}
                    </Link>
                  </ContextMenuTrigger>
                  <span>
                    <DropdownMenu key={title}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-85 more-settings invisible group-hover:visible p-1"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <SettingsMenu
                        type="dropdown"
                        item={item}
                        context={context}
                      />
                    </DropdownMenu>
                    <AddNewPageDialog parent={item} />
                  </span>
                </span>
                <SettingsMenu type="context" context={context} item={item} />
              </ContextMenu>
            );
          }}
        >
          <Tree treeId="tree-1" rootItem="root" treeLabel="pages" />
        </ControlledTreeEnvironment>
      </SidebarMenu>
    </SidebarGroup>
  );
}
