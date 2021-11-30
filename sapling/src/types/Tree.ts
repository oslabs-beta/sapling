// React component tree is a nested data structure, children are Trees

export type Tree = {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  importPath: string;
  expanded: boolean;
  depth: number;
  count: number;
  thirdParty: boolean;
  reactRouter: boolean;
  reduxConnect: boolean;
  children: Array<Tree>;
  parentList: string[];
  props: Record<string, boolean>;
  error: string;
};
