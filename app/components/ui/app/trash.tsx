import { Trash2, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Input } from "../input";
import { SidebarMenuButton } from "../sidebar";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { useState } from "react";
import { ControlledTreeEnvironment, Tree } from "../tree";
import { useFetcher } from "@remix-run/react";
import IconButton from "./icon-button";
import { SelectParent } from "./select-parent";
import { PageTreeItem } from "~/schemas/workspace.schema";
import { PopoverPortal } from "@radix-ui/react-popover";

export function Trash() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const archivedPages = useWorkspaceStore(
    (state) => state.workspace?.archivedPages
  );
  const fetcher = useFetcher();

  const archiveAction = useWorkspaceStore((state) => state.archiveAction);

  return (
    <Popover open={open} onOpenChange={(e) => setOpen(e)}>
      <PopoverTrigger asChild>
        <SidebarMenuButton onClick={() => setOpen(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Open trash
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          className="w-100 bg-background border rounded-md max-h-[30rem]"
          align="end"
          sideOffset={15}
          asChild
          onFocusOutside={(e) => e.preventDefault()}
          side="right"
        >
          <div className="flex gap-4 flex-col h-full">
            {/* Search Input */}
            <div className="relative p-2">
              <Search className="text-muted-foreground w-4 h-4 absolute top-[1.1rem] left-[1rem]" />
              <Input
                placeholder="Search trashed items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Results */}
            <div className="overflow-auto px-6">
              <ControlledTreeEnvironment<string>
                className="relative"
                items={archivedPages ?? {}}
                getItemTitle={(item) => item.data}
                viewState={{}}
                autoFocus={false}
                renderItemTitle={({ title, item }) => (
                  <span className="flex flex-row w-full gap-2 items-center">
                    <span className="flex-grow ">{title}</span>
                    <SelectParent page={item as PageTreeItem} />
                    <IconButton
                      className="h-4 w-4"
                      tooltipContent="Destroy this page. Operation cannot be undone"
                      onClick={() =>
                        archiveAction(
                          {
                            pageId: item.index as string,
                            actionType: "remove",
                          },
                          fetcher
                        )
                      }
                    >
                      <Trash2 className="text-red-600" />
                    </IconButton>
                  </span>
                )}
              >
                <Tree treeId="tree-1" rootItem="root" />
              </ControlledTreeEnvironment>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <p className="text-xs text-muted-foreground text-center">
                Pages in trash over the last 30 days will automatically be
                deleted
              </p>
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
