import React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type MenuType = "dropdown" | "context";

export interface MenuItem {
  type: "item" | "seperator" | "sub" | "checkbox";
  label?: string;
  onSelect?: () => void;
  checked?: boolean;
  icon?: React.ReactNode;
  subItems?: MenuItem[];
  onClick?: () => void;
}

export const menuComponents = {
  context: {
    Root: ContextMenu,
    Trigger: ContextMenuTrigger,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    Separator: ContextMenuSeparator,
    Sub: ContextMenuSub,
    SubTrigger: ContextMenuSubTrigger,
    SubContent: ContextMenuSubContent,
    CheckboxItem: ContextMenuCheckboxItem,
    Label: ContextMenuLabel,
    Group: ContextMenuGroup,
    Shortcut: ContextMenuShortcut,
    Portal: ContextMenuPortal,
  },
  dropdown: {
    Root: DropdownMenu,
    Trigger: DropdownMenuTrigger,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
    Separator: DropdownMenuSeparator,
    Sub: DropdownMenuSub,
    SubTrigger: DropdownMenuSubTrigger,
    SubContent: DropdownMenuSubContent,
    CheckboxItem: DropdownMenuCheckboxItem,
    Label: DropdownMenuLabel,
    Group: DropdownMenuGroup,
    Shortcut: DropdownMenuShortcut,
    Portal: DropdownMenuPortal,
  },
};

export type MenuItemProps = {
  item: MenuItem;
  type: MenuType;
  renderItem?: (props: { item: MenuItem }) => React.ReactElement;
  onSelect?: () => void;
} & React.ComponentProps<"div">;

export const MenuItem: React.FC<MenuItemProps> = ({
  type,
  item,
  renderItem,
  ...props
}) => {
  const Menu = menuComponents[type];
  const ItemComponent = renderItem?.({ item }) ?? item.label;

  switch (item.type) {
    case "checkbox":
      return (
        <Menu.CheckboxItem checked={item.checked} {...props}>
          {ItemComponent}
        </Menu.CheckboxItem>
      );
    case "item":
      return (
        <Menu.Item {...props} onClick={props.onClick}>
          {ItemComponent}
        </Menu.Item>
      );
    case "seperator":
      return <Menu.Separator />;
    case "sub":
      return (
        <Menu.Sub>
          <Menu.SubTrigger>{ItemComponent}</Menu.SubTrigger>
          <Menu.Portal>
            <Menu.SubContent>
              {item.subItems?.map((subItem, idx) => (
                <MenuItem
                  key={idx}
                  item={subItem}
                  type={type}
                  renderItem={renderItem}
                  {...props}
                  onClick={subItem.onClick}
                />
              ))}
            </Menu.SubContent>
          </Menu.Portal>
        </Menu.Sub>
      );
  }
};
