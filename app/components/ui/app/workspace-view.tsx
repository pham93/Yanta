import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar";
import AddNewPageDialog from "./new-page-dialog";
import { ContextMenu, ContextMenuTrigger } from "../context-menu";
import { Link, useFetcher } from "@remix-run/react";
import { DropdownMenu, DropdownMenuTrigger } from "../dropdown-menu";
import { Button } from "../button";
import { MoreVertical } from "lucide-react";
import SettingsMenu from "./settings-menu";
import { ControlledTreeEnvironment, Tree } from "../tree";
import { TreeItem, TreeItemIndex } from "react-complex-tree";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { Skeleton } from "../skeleton";

export function WorkspaceView() {
  const updatePage = useWorkspaceStore((state) => state.updatePage);
  const fetcher = useFetcher();

  const workspace = useWorkspaceStore((state) => state.workspace);

  const isLoading = useWorkspaceStore((state) => state.isLoading);

  if (!workspace && !isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Create new workspace</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  if (!workspace) {
    return (
      <div className="w-full px-2">
        <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
        <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
        <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
        <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
        <Skeleton className="w-full h-6 mt-2 rounded-none"></Skeleton>
      </div>
    );
  }

  const handleRename = (pageTreeItem: TreeItem<string>, name: string) => {
    pageTreeItem.data = name;
    updatePage({ id: pageTreeItem.index as string, title: name }, fetcher);
  };

  const handleOnTreeChange = (
    newTree: Record<TreeItemIndex, TreeItem<string>>
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
        <ControlledTreeEnvironment<string>
          items={workspace.pages}
          viewState={{}}
          renderDepthOffset={10}
          className="mt-0"
          getItemTitle={(item) => item.data ?? "New Title"}
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
                <span className="group flex items-center justify-between w-full">
                  <ContextMenuTrigger asChild>
                    <Link
                      className="text-left flex-shrink text-ellipsis flex-grow"
                      to={`/${workspace.id}/${item.index}`}
                    >
                      {title}
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
