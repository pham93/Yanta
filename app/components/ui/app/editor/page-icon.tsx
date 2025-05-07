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
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Handle icon/emoji selection
  const handleSelect = (icon: string) => {
    setSelectedIcon(icon);
    setOpen(false);
  };

  // Handle remove icon
  const handleRemove = () => {
    setSelectedIcon(null);
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
          className={cn("w-20 h-20 p-0 [&_svg]:size-8", className)}
        >
          {selectedIcon ? (
            selectedIcon.includes("Lucide") ? (
              <DynamicIcon
                name={selectedIcon.replace("Lucide", "")}
                className="text-4xl h-9 w-9"
              />
            ) : (
              <span className="text-4xl">{selectedIcon}</span>
            )
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
                  onClick={() => handleSelect("Lucide" + icon)}
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
