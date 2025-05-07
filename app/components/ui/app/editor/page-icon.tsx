// IconEmojiPicker.tsx
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";

import { icons } from "lucide-react";

import DynamicIcon from "../../dynamic-icon";
import { cn } from "~/lib/utils";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "components/ui/emoji-picker";
import { useFetcher } from "@remix-run/react";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { useEditorStore } from "~/providers/editor.provider";

// Utility to get all Lucide icon names
const lucideIconNames = Object.keys(icons);

export function IconEmojiPicker({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const icon = useEditorStore((state) => state.icon);
  const updateEditor = useEditorStore((state) => state.update);
  const [search, setSearch] = useState("");
  const fetcher = useFetcher();
  const updatePage = useWorkspaceStore((state) => state.updatePage);
  const editorStateId = useEditorStore((state) => state.id);

  // Handle icon/emoji selection
  const handleSelect = (icon: string) => {
    updateEditor({ icon });
    if (editorStateId) {
      updatePage({ id: editorStateId, icon }, fetcher);
    }
    setOpen(false);
  };

  // Handle remove icon
  const handleRemove = () => {
    updateEditor({ icon });
    if (editorStateId) {
      updatePage({ id: editorStateId, icon }, fetcher);
    }
    setOpen(false);
  };

  // Filter Lucide icons based on search
  const filteredLucideIcons = lucideIconNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        disabled={disabled}
        className="disabled:opacity-100"
      >
        <Button
          variant="ghost"
          className={cn(
            "w-20 h-20 p-0 [&_svg]:size-8 bg-slate-900 bg-opacity-75",
            "hover:bg-opacity-15 hover:bg-slate-950",
            className
          )}
        >
          {icon ? (
            <DynamicIcon
              name={icon}
              className="text-4xl w-full h-full justify-center items-center flex"
            />
          ) : (
            <span className="text-sm">
              No <br /> icon
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[20rem] p-1 flex"
        align="start"
        side="bottom"
      >
        <Tabs defaultValue="emojis" className="w-full flex flex-col">
          <div className="flex items-center justify-between">
            <TabsList className="bg-background">
              <TabsTrigger value="emojis">Emojis</TabsTrigger>
              <TabsTrigger value="icons">Icons</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <Button variant={"ghost"} onClick={handleRemove} size={"sm"}>
              Remove
            </Button>
          </div>
          <TabsContent value="emojis" className="p-0 h-full">
            <Emoji onEmojiSelect={(emoji) => handleSelect(emoji.emoji)} />
          </TabsContent>

          <TabsContent value="icons" className="p-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-64 overflow-auto grid grid-cols-6 gap-1">
              {filteredLucideIcons.map((icon) => (
                <Button
                  key={icon}
                  variant={"ghost"}
                  className="max-h-8 max-w-8 text-md"
                  onClick={() => handleSelect(icon)}
                >
                  <DynamicIcon name={icon} />
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <div className="h-60 flex items-center justify-center">
              <p>Upload functionality coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export const Emoji = (props: React.ComponentProps<typeof EmojiPicker>) => {
  return (
    <EmojiPicker className="p-0 flex h-[300px]" {...props}>
      <EmojiPickerSearch />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  );
};
