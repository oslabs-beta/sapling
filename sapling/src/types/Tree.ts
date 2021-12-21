// Tree type used by SaplingParser

// The component tree is a nested data structure, where children are Trees
export type Tree = {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  importPath: string;
  isExpanded: boolean;
  depth: number;
  count: number;
  isThirdParty: boolean;
  isReactRouter: boolean;
  hasReduxConnect: boolean;
  children: Array<Tree>;
  parentList: string[];
  props: Record<string, boolean>;
  error: string;
};
