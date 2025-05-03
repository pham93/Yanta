import { useWorkspaceStore } from "~/store/workspaces.store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import IconButton from "./icon-button";
import { Check, Loader2, Undo2 } from "lucide-react";
import { useFetcher } from "@remix-run/react";
import { Button } from "../button";
import { ControlledTreeEnvironment, Tree } from "../tree";
import { useState } from "react";
import { TreeItemIndex } from "react-complex-tree";

interface SelectParentProps {
  page: { data: string; index: string };
  renderTriggerButton?: () => React.ReactElement;
}

export function SelectParent({ page, renderTriggerButton }: SelectParentProps) {
  const workspace = useWorkspaceStore((state) => state.workspace);
  const fetcher = useFetcher();
  const archiveAction = useWorkspaceStore((state) => state.archiveAction);
  const [selectedParent, setSelectedParent] = useState<TreeItemIndex>("");

  if (!workspace) {
    return;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {renderTriggerButton ? (
          renderTriggerButton()
        ) : (
          <IconButton
            tooltipContent="Unarchive page"
            className="w-4 h-4"
            size="icon"
          >
            <Undo2 />
          </IconButton>
        )}
      </DialogTrigger>
      <DialogContent autoFocus={false} onOpenAutoFocus={() => {}}>
        <DialogHeader>
          <DialogTitle>Choose parent</DialogTitle>
          <DialogDescription>Select parent for {page.data}</DialogDescription>
          <DialogClose></DialogClose>
        </DialogHeader>
        <ControlledTreeEnvironment
          items={workspace.pages}
          autoFocus={false}
          viewState={{
            ["tree-1"]: {
              selectedItems: [selectedParent],
            },
          }}
          getItemTitle={(item) => item.data ?? ""}
          renderItemTitle={({ context, item }) => {
            return (
              <button
                className="flex flex-row justify-between w-full items-center pr-2"
                onClick={() => {
                  setSelectedParent(context.isSelected ? "" : item.index);
                }}
              >
                {item.data}
                {context.isSelected && (
                  <Check className="h-4 w-4 text-green-300" />
                )}
              </button>
            );
          }}
        >
          <Tree treeId="tree-1" rootItem="root" />
        </ControlledTreeEnvironment>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={() => {
              archiveAction(
                {
                  pageId: page.index as string,
                  newParent: selectedParent as string,
                  actionType: "unarchive",
                },
                fetcher
              );
            }}
          >
            Ok
            {fetcher.state !== "idle" && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
