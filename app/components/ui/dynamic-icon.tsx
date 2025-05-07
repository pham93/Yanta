import { icons, LucideIcon } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function DynamicIcon({
  name,
  ...props
}: ComponentProps<LucideIcon> & { name: string }) {
  const Icon = icons[name as keyof typeof icons] || null;

  if (!Icon) {
    return <span className={cn("size-4", props.className)}>{name}</span>;
  }

  return <Icon {...props} />;
}

export default DynamicIcon;
