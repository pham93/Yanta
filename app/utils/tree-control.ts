import { TreeItem, TreeItemIndex } from "react-complex-tree";

type Tree<T = unknown> = Record<TreeItemIndex, TreeItem<T>>;

export function removeTreeItem(target: TreeItem<unknown>, tree: Tree<unknown>) {
  const newTree = { ...tree };
  const treeArr = Object.values(tree);
  const parent = treeArr.find((e) =>
    e.children?.some((idx) => idx === target.index)
  );

  if (!parent) {
    return { newTree, removedItems: {} };
  }

  // remove the target
  parent.children = parent?.children?.filter((e) => e !== target.index);

  // remove all the decesdants
  const removedItems: Record<TreeItemIndex, TreeItem> = {};
  treeLoop(newTree, target.index, (node) => {
    delete newTree[node.index];
    removedItems[node.index] = node;
  });

  return { newTree, removedItems };
}

export function treeLoop(
  tree: Tree<unknown>,
  rootId: TreeItemIndex,
  callback: (id: TreeItem<unknown>) => void
) {
  const parent = tree[rootId];
  callback(parent);
  if (!parent.children) {
    return;
  }
  for (const a of parent.children) {
    treeLoop(tree, a, callback);
  }
}

export function addTreeItem(
  target: TreeItem<unknown>,
  tree: Tree<unknown>,
  parent?: TreeItem<unknown>
) {
  // parent?
  if (!parent) {
    const treeArr = Object.values(tree);
    parent =
      treeArr.find((e) => e.children?.some((idx) => idx === target.index)) ??
      tree["root"] ??
      createDefaultRoot();
  }

  const children = parent.children ?? [];

  parent.children = [...children, target.index];

  // add the new page to tree
  tree[target.index] = target;
  tree[parent.index] = parent;

  return { ...tree };
}

export function createDefaultRoot() {
  return {
    data: "",
    index: "root",
    children: [],
  };
}
