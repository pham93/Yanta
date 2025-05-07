import { icons, LucideIcon } from "lucide-react";
import { ComponentProps } from "react";

function DynamicIcon({
  name,
  ...props
}: ComponentProps<LucideIcon> & { name: string }) {
  const Icon = icons[name as keyof typeof icons] || null;

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
}

export default DynamicIcon;
