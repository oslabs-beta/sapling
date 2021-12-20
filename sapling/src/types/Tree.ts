import { getNonce } from '../helpers/getNonce';

// Tree type used by SaplingParser
// The component tree is a nested data structure, where children are Trees
export class Tree {
  readonly id: string;
  readonly name: string;
  readonly fileName: string;
  readonly filePath: string;
  readonly importPath: string;
  expanded: boolean;
  depth: number;
  count: number;
  thirdParty: boolean;
  reactRouter: boolean;
  reduxConnect: boolean;
  readonly children: Array<Tree>;
  readonly parentId: string | null | undefined;
  readonly parentList: string[];
  readonly props: Record<string, boolean>;
  error: '' | 'File not found.' | 'Error while processing this file/node';

  constructor(node?: Partial<Tree>) {
    this.id = getNonce(); // shallow copies do not share identifiers
    this.name = node?.name || '';
    this.fileName = node?.fileName || '';
    this.filePath = node?.filePath || '';
    this.importPath = node?.importPath || '';
    this.expanded = node?.expanded || false;
    this.depth = node?.depth || 0;
    this.count = node?.count || 1;
    this.thirdParty = node?.thirdParty || false;
    this.reactRouter = node?.reactRouter || false;
    this.reduxConnect = node?.reduxConnect || false;
    this.children = node?.children || [];
    this.parentId = node?.parentId;
    this.parentList = node?.parentList || [];
    this.props = node?.props || {};
    this.error = node?.error || '';
  }

  /** Getter for descendant nodes in the subtree of 'this'.
   * @param id
   * @returns Tree node with matching id, or undefined if not found.
   * @param filePath
   * @returns Array of matching Tree nodes, or empty array if none are found.
   */
  public get(...input: string[]): Tree | Array<Tree> | undefined;
  /** Get by following traversal path from root to target node
   * @param path: path expressed by sequence of each intermediate vertex's index in its parent's children array property.
   * e.g. (0) is the first child of root
   * e.g. (0, 2, 1) would be the second child of the third child of the first child of root
   * i.e. this.children[0].children[2].children[1]
   * @returns the Tree node found at the destination of this traversal path
   */
  public get(...path: number[]): Tree;
  public get(...input: Array<unknown>): unknown {
    if (
      !input ||
      !Array.isArray(input) ||
      !input.length ||
      (typeof input[0] === 'string' && input.length > 1) ||
      (typeof input[0] !== 'string' && typeof input[0] !== 'number')
    ) {
      throw new Error('Invalid input type.');
    }
    if (typeof input[0] === 'string') {
      const getById: Tree | undefined = this.subTree.filter(({ id }) => input[0] === id).pop();
      const getByFilePath: Array<Tree> = this.subTree.filter(
        ({ filePath }) => input[0] === filePath
      );
      return getById === undefined && !getByFilePath.length ? undefined : getById || getByFilePath;
    }
    return input.reduce((acc: Tree, curr: number, i) => {
      if (!acc || !acc.children[curr]) {
        throw new Error(`Invalid entry at index ${i} of input path array.`);
      }
      if (curr < 0 || curr >= acc.children.length) {
        throw new Error(`Entry out of bounds at index ${i} of input path array.`);
      }
      return acc.children[curr];
    }, this) as Tree;
  }

  public isEmpty(): boolean {
    return !this.name.length || this.parentId === undefined;
  }

  public isRoot(): boolean {
    return !this.isEmpty() && this.parentId === null;
  }

  public isFile(): boolean {
    return !this.thirdParty && !this.reactRouter;
  }

  /** Switches expanded property state.
   * @param expandedState if not undefined, defines value of expanded property for this node.
   * If expandedState is undefined, expanded property is negated.
   */
  public toggleExpanded(expandedState?: boolean): void {
    this.expanded = expandedState === undefined ? !this.expanded : expandedState;
  }

  public findAndToggleExpanded(id: string, expandedState?: boolean): void {
    const target = this.get(id) as Tree | undefined;
    if (target === undefined) throw new Error('Invalid input id.');
    target.toggleExpanded(expandedState);
  }

  /** @returns Normalized array containing all descendants in subtree of 'this' except for the root node. */
  private get subTree(): Array<Tree> {
    const descendants: Array<Tree> = [];
    const callback = (node: Tree) => {
      descendants.push(...node.children);
    };
    this.traverse(callback);
    return descendants;
  }

  // Traverses all nodes of current component tree and applies callback to each node
  private traverse(callback: (node: Tree) => void): void {
    callback(this);
    if (!this.children || !this.children.length) return;
    this.children.forEach((child) => {
      child.traverse(callback);
    });
  }
}
