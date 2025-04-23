// src/components/ui/tree.tsx
import React, { useState } from "react";
import {
  ControlledTreeEnvironment as XControlledTreeEnvironment,
  Tree,
  ControlledTreeEnvironmentProps as XControlledTreeEnvironmentProps,
  StaticTreeDataProvider,
  TreeItemIndex,
  TreeItem,
  DraggingPosition,
  DraggingPositionItem,
  DraggingPositionBetweenItems,
} from "react-complex-tree";
import { Check, LucideChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import style from "./tree.module.css";
import { Input } from "./input";

declare module "react-complex-tree" {
  interface TreeItem<T> {
    data: T;
    isLoading?: boolean;
  }
}

// Props for the Tree component, making key handlers required
type TreeProps<T> = {
  animationSpeed?: number;
  onTreeOrderChange?: (items: Record<TreeItemIndex, TreeItem<T>>) => void;
} & React.ComponentProps<typeof XControlledTreeEnvironment<T>> &
  React.HTMLAttributes<HTMLDivElement>;

type RenderProps<T> = Parameters<
  NonNullable<XControlledTreeEnvironmentProps["renderItem"]>
>[0] & { treeProps: TreeProps<T> };

const DEFAULT_DEPTH_OFFSET = 16;

const RenderItem = <T = string,>({
  item,
  depth,
  children,
  arrow,
  title,
  context,
  treeProps,
}: RenderProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(context.isExpanded);
  const animationSpeed = treeProps.animationSpeed ?? 0;
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={(isOpened) => {
        context.expandItem();
        setIsExpanded(isOpened);
        if (!isOpened) {
          setTimeout(() => context.collapseItem(), animationSpeed);
        }
      }}
      {...context.itemContainerWithChildrenProps}
      className={cn({
        "border-2 border-dotted dark:border-gray-300 border-gray-700 rounded-sm":
          context.isDraggingOver,
      })}
    >
      <Button
        variant="ghost"
        role="menuitem"
        className={cn(
          "w-full justify-start px-1 py-1 gap-1 focus-visible:ring-primary h-8 cursor-pointer",
          { "animate-pulse pointer-events-none": item.isLoading }
        )}
        {...context.itemContainerWithoutChildrenProps}
        {...context.interactiveElementProps}
        onClick={() => {}}
        type="button"
        size="default"
        style={{
          paddingLeft: `${
            depth * (treeProps.renderDepthOffset ?? DEFAULT_DEPTH_OFFSET) + 4
          }px`,
        }}
        asChild
      >
        <li>
          {/* carot */}
          {item.children && item.children.length > 0 ? (
            <CollapsibleTrigger
              asChild
              className={cn("cursor-pointer duration-200 min-w-4 min-h-4", {
                "rotate-90": isExpanded,
              })}
            >
              <span>
                {treeProps.renderItemArrow ? arrow : <LucideChevronRight />}
              </span>
            </CollapsibleTrigger>
          ) : (
            <span className="node-no-children min-w-4 min-h-4"></span>
          )}
          {title}
        </li>
      </Button>

      {/* Nested children */}
      {item.children && item.children.length > 0 && (
        <CollapsibleContent
          className={cn(
            style.CollapsibleContent,
            "p-[2px]",

            { "animate-pulse pointer-events-none opacity-40": item.isLoading }
          )}
          style={
            {
              "--collapsible-speed": `${animationSpeed}ms`,
            } as React.CSSProperties
          }
        >
          {children}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

const ControlledTreeEnvironment = <T = string,>({
  className,
  ref,
  viewState,
  ...props
}: TreeProps<T>) => {
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);

  const handleDrop = (items: TreeItem<T>[], target: DraggingPosition) => {
    const newTreeData = { ...props.items };

    const handleEach = (item: TreeItem<T>) => {
      const itemId = item.index;
      const currentParent = Object.values(newTreeData).find((node) =>
        node.children?.includes(itemId)
      );
      if (currentParent) {
        // Remove item from current parent
        newTreeData[currentParent.index].children = newTreeData[
          currentParent.index
        ]?.children?.filter((child) => child !== itemId);
      }

      let newParent = newTreeData["root"];
      let newIdx = target.linearIndex;
      switch (target.targetType) {
        case "item": {
          const { targetItem } = target as DraggingPositionItem;
          newParent = newTreeData[targetItem];
          break;
        }
        case "between-items": {
          const { childIndex, parentItem } =
            target as DraggingPositionBetweenItems;
          newParent = newTreeData[parentItem];
          newIdx = childIndex;
          break;
        }
      }
      const children = newParent.children ?? [];
      children.splice(newIdx, 0, itemId);
      newParent.children = children;
    };

    items.forEach((item) => handleEach(item));

    props.onTreeOrderChange?.(newTreeData);
  };

  return (
    <XControlledTreeEnvironment<T, string>
      onFocusItem={(item) => setFocusedItem(item.index)}
      onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
      onDrop={handleDrop}
      onCollapseItem={(item) =>
        setExpandedItems(
          expandedItems.filter(
            (expandedItemIndex) => expandedItemIndex !== item.index
          )
        )
      }
      viewState={{
        ["tree-1"]: {
          focusedItem,
          expandedItems,
        },
        ...viewState,
      }}
      {...props}
      ref={ref}
      renderItem={(itemProps) => (
        <RenderItem<T> {...itemProps} treeProps={{ ...props, viewState }} />
      )}
      renderTreeContainer={({ children, containerProps }) => (
        <div
          {...containerProps}
          className={cn("tree-container w-full bg-background", className)}
        >
          {children}
        </div>
      )}
      renderItemsContainer={({ children, containerProps }) => (
        <div {...containerProps} className="tree-group-container">
          {children}
        </div>
      )}
      renderDragBetweenLine={({ lineProps }) => {
        return (
          <div
            {...lineProps}
            className="border-2 dark:border-gray-300 border-gray-700 w-full rounded-lg"
          ></div>
        );
      }}
      renderRenameInput={({
        inputRef,
        inputProps,
        formProps,
        submitButtonRef,
        submitButtonProps,
      }) => (
        <>
          <form
            {...formProps}
            className="flex flex-row  w-full h-6 z-20 relative gap-2"
          >
            <Input
              placeholder="Rename"
              name="rename"
              autoFocus
              ref={inputRef}
              {...inputProps}
              className="h-6"
            />
            <Button
              ref={submitButtonRef}
              {...submitButtonProps}
              size={"icon"}
              variant={"ghost"}
              className="h-6"
              type="button"
            >
              <Check className="s-2" />
            </Button>
          </form>
        </>
      )}
    />
  );
};

export {
  ControlledTreeEnvironment as ControlledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
};
