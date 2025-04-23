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
import { Loader2, PlusIcon } from "lucide-react";
import { Editor } from "./editor/editor";
import { useFetcher, useParams } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import { PageInsert, PageTreeItem } from "~/schemas/workspace.schema";
import { v4 as uuid } from "uuid";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { EditorProvider } from "~/providers/editor.provider";
import { createEditorStore } from "~/store/editor.store";
import { cn } from "~/lib/utils";
import { TreeItem } from "react-complex-tree";
import { clientAction } from "~/routes/$workspace.tree";

function AddNewPageDialog({ parent }: { parent?: TreeItem<string> }) {
  const fetcher = useFetcher<typeof clientAction>();
  const [open, setOpen] = useState(false);
  const { workspace: workspaceId } = useParams();
  const store = useMemo(() => createEditorStore({}), []);

  const addPage = useWorkspaceStore((state) => state.addPage);

  const handleClick = useCallback(() => {
    const state = store.getState();
    const newPage: PageInsert = {
      ...state,
      workspaceId: workspaceId as string,
      id: uuid(),
    };
    addPage(newPage, parent as PageTreeItem, fetcher);
    setOpen(false);
  }, [store, addPage, parent, workspaceId, fetcher]);

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
            onClick={() => handleClick()}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AddNewPageDialog;
