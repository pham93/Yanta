import { TreeItem, TreeItemIndex } from "react-complex-tree";

type Tree<T = unknown> = Record<TreeItemIndex, TreeItem<T>>;

export function removeTreeItem(page: TreeItem<unknown>, tree: Tree<unknown>) {
  const newTree = { ...tree };
  const treeArr = Object.values(tree);
  const parent = treeArr.find((e) =>
    e.children?.some((idx) => idx === page.index)
  );

  if (!parent) {
    return { newTree, removedItems: [page.index] };
  }

  parent.children = parent?.children?.filter((e) => e !== page.index);

  const indexes: string[] = [];

  treeLoop(newTree, page.index, ({ index }) => {
    indexes.push(index as string);
  });

  indexes.forEach((e) => delete newTree[e]);

  return { newTree, removedItems: indexes };
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
  page: TreeItem<unknown>,
  tree: Tree<unknown>,
  parent?: TreeItem<unknown>
) {
  // parent?
  if (!parent) {
    const treeArr = Object.values(tree);
    parent = treeArr.find((e) => e.children?.some((idx) => idx === page.index));
  }

  // still no parent?
  if (!parent) {
    parent = tree["root"];
  }
  const children = parent.children ?? [];

  parent.children = [...children, page.index];
  // add the new page to tree
  tree[page.index] = page;

  return { ...tree };
}

export const ROOT_NODE = {
  data: "",
  index: "root",
  children: [],
};
