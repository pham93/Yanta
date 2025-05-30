import {
  Copy,
  CopyIcon,
  Edit,
  ExternalLink,
  LucideStar,
  Move,
  Trash,
  Trash2,
} from "lucide-react";
import {
  menuComponents,
  MenuItem,
  MenuItemProps,
  MenuType,
} from "../menu-item";
import { TreeItem, TreeItemRenderContext } from "react-complex-tree";
import { useWorkspaceStore } from "~/store/workspaces.store";
import { PageTreeItem } from "~/schemas/workspace.schema";
import { useFetcher } from "@remix-run/react";

export interface SettingMenuProps {
  type: MenuType;
  context: TreeItemRenderContext<string>;
  item: TreeItem<PageTreeItem["data"]>;
}

type SettingItem = MenuItem & {
  subItems: SettingItem[];
};

const renderItem: MenuItemProps["renderItem"] = ({ item }) => (
  <li className="min-w-24 w-48 flex gap-2 flex-row [&>svg]:h-4 [&>svg]:w-4 justify-start items-center">
    {item.icon}
    {item.label}
  </li>
);

const SettingsMenu = ({ type, context, item }: SettingMenuProps) => {
  const Menu = menuComponents[type];
  const fetcher = useFetcher();
  const removePage = useWorkspaceStore((store) => store.removePage);

  const settingsItem = [
    {
      label: "Add to favorite",
      type: "item",
      icon: <LucideStar />,
    },
    {
      type: "seperator",
    },
    {
      label: "Copy Link",
      type: "item",
      icon: <CopyIcon />,
    },
    {
      label: "Duplicate",
      type: "item",
      icon: <Copy />,
    },
    {
      label: "Rename",
      type: "item",
      icon: <Edit />,
      onClick: () => context.startRenamingItem(),
    },
    {
      label: "Remove",
      type: "item",
      icon: <Trash2 />,
      onClick: () => removePage(item as PageTreeItem, fetcher),
    },
    {
      label: "Move to",
      type: "item",
      icon: <Move />,
    },
    {
      label: "Move to Trash",
      type: "checkbox",
      checked: true,
      icon: <Trash />,
    },
    { type: "seperator" },
    {
      label: "Open in New tab",
      type: "item",
      icon: <ExternalLink />,
    },
  ] as SettingItem[];

  return (
    <Menu.Content className="w-64">
      {settingsItem.map((item, _idx) => (
        <MenuItem
          key={_idx}
          item={item}
          type={type}
          renderItem={renderItem}
          onClick={item.onClick}
        />
      ))}
    </Menu.Content>
  );
};
export default SettingsMenu;
