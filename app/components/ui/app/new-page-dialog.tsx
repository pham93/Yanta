import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import IconButton from "./icon-button";
import { PlusIcon } from "lucide-react";
import { Editor } from "./editor/editor";
import { useFetcher, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { PageTreeInsertItem, PageTreeItem } from "~/schemas/workspace.schema";
import { v4 as uuid } from "uuid";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { clientAction } from "~/routes/$workspace";
import { EditorProvider } from "~/providers/editor.provider";
import { createEditorStore } from "~/store/editor.store";

const store = createEditorStore({});

function AddNewPageDialog({ parent }: { parent?: PageTreeItem }) {
  const fetcher = useFetcher<typeof clientAction>();
  const [open, setOpen] = useState(false);
  const { workspace: workspaceId } = useParams();

  const addNewPage = useWorkspaceStore((state) => state.addNewPage);

  useEffect(() => {
    console.log(fetcher.data);
  }, [fetcher.state, fetcher.data]);

  const handleClick = (pageTreeNode: PageTreeInsertItem) => {
    const state = store.getState();
    if (state) {
      addNewPage(
        pageTreeNode,
        {
          ...state,
          workspaceId: workspaceId as string,
          id: pageTreeNode.index as string,
        },
        parent,
        fetcher
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <IconButton
          onClick={(e) => e.stopPropagation()}
          tooltipProps={{ delayDuration: 0 }}
          tooltipContent="Add a page inside"
          tooltipContentProps={{ side: "bottom" }}
          size="sm"
          className="opacity-85 group-hover:visible p-1 invisible"
        >
          <PlusIcon className="w-4 h-4" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="max-w-[60svw] max-h-[50svh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle className="pt-5 pl-5">Create new</DialogTitle>
        </DialogHeader>
        <EditorProvider store={store}>
          <Editor />
        </EditorProvider>
        <DialogFooter className="p-3">
          <Button
            type="button"
            variant={"secondary"}
            disabled={fetcher.state === "loading"}
            onClick={() =>
              handleClick({
                index: uuid(),
                data: "",
                canRename: true,
                canMove: true,
                isFolder: true,
              })
            }
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AddNewPageDialog;
