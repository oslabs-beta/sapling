import { getNonce } from '../helpers/getNonce';
import { SaplingParser } from '../SaplingParser';

export class Tree {
  readonly id: string;
  readonly name: string;
  readonly fileName: string;
  readonly filePath: string;
  readonly importPath: string;
  isExpanded: boolean;
  depth: number;
  count: number;
  isThirdParty: boolean;
  isReactRouter: boolean;
  hasReduxConnect: boolean;
  readonly children: Array<Tree>;
  readonly parentId: string | null | undefined;
  readonly parentList: string[];
  props: Record<string, boolean>;
  error: '' | 'File not found.' | 'Error while processing this file/node.';

  constructor(node?: Partial<Tree>) {
    this.id = getNonce(); // shallow copies made from constructor do not share identifiers
    this.name = node?.name || '';
    this.fileName = node?.fileName || '';
    this.filePath = node?.filePath || '';
    this.importPath = node?.importPath || '';
    this.isExpanded = node?.isExpanded || false;
    this.depth = node?.depth || 0;
    this.count = node?.count || 1;
    this.isThirdParty = node?.isThirdParty || false;
    this.isReactRouter = node?.isReactRouter || false;
    this.hasReduxConnect = node?.hasReduxConnect || false;
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
      const { subtree } = this;
      const getById: Tree | undefined = subtree.filter(({ id }) => input[0] === id).pop();
      const getByFilePath: Array<Tree> = subtree.filter(({ filePath }) => input[0] === filePath);
      if (!getById && !getByFilePath.length) {
        throw new Error('Node not found with input: ' + input[0]);
      }
      return getById || getByFilePath;
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

  /** Modifies value of public class fields.
   * Prohibits mutation of readonly properties: 'id', 'name', ' fileName', 'filePath', 'importPath', 'parentId', 'parentList'.
   */
  public set(key: keyof Tree, value: Tree[keyof Tree]): void {
    if (key === 'children') {
      if (value && Array.isArray(value) && (!value.length || value[0] instanceof Tree)) {
        this[key].splice(0, this.children.length);
        this[key].push(...(value as Array<Tree>));
      } else throw new Error('Invalid children array.');
    } else if (
      ['id', 'name', ' fileName', 'filePath', 'importPath', 'parentId', 'parentList'].includes(
        key as string
      )
    ) {
      throw new Error('Cannot alter readonly property: ' + key + '. Create new tree instead.');
    }
    // @ts-expect-error
    else this[key] = value;
  }

  public isEmpty(): boolean {
    return !this.name.length || this.parentId === undefined;
  }

  public isRoot(): boolean {
    return !this.isEmpty() && this.parentId === null;
  }

  public isFile(): boolean {
    return !this.isThirdParty && !this.isReactRouter;
  }

  /** Switches isExpanded property state. */
  private toggleExpanded(): void {
    this.set('isExpanded', !this.isExpanded);
  }

  /** Finds subtree node and changes isExpanded property state.
   * @param expandedState if not undefined, defines value of isExpanded property for target node.
   * If expandedState is undefined, isExpanded property is negated.
   */
  public findAndToggleExpanded(id: string, expandedState?: boolean): void {
    const target = this.get(id) as Tree | undefined;
    if (target === undefined) throw new Error('Invalid input id.');
    if (expandedState === undefined) target.toggleExpanded();
    else target.set('isExpanded', expandedState);
  }

  /** Triggers on file save event.
   * Finds node(s) that match saved document's file path,
   * reparses their subtrees to reflect updated document content,
   * and restores previous isExpanded state for descendants.
   */
  public updateOnSave(savedFilePath: string): void {
    const targetNodes = this.get(savedFilePath) as Array<Tree>;
    if (!targetNodes.length) {
      throw new Error('No nodes were found with file path: ' + savedFilePath);
    }
    targetNodes.forEach((target) => {
      const prevState = target.subtree.map((node) => {
        const { depth, filePath, isExpanded } = node;
        return { depth, filePath, isExpanded };
      });

      // Subtree of target is newly parsed in-place.
      SaplingParser.parse(target);

      const restoreExpanded = (node: Tree): void => {
        node.set(
          'isExpanded',
          prevState.some(
            ({ depth, filePath, isExpanded }) =>
              isExpanded && node.depth === depth && node.filePath === filePath
          )
        );
      };
      target.traverse(restoreExpanded);
    });
  }

  /** @returns Normalized array containing all descendants in subtree of current node. */
  private get subtree(): Array<Tree> {
    const descendants: Array<Tree> = [];
    const callback = (node: Tree) => {
      descendants.push(...node.children);
    };
    this.traverse(callback);
    return [this, ...descendants];
  }

  // Traverses all nodes of current component tree and applies callback to each node
  public traverse(callback: (node: Tree) => void): void {
    callback(this);
    if (!this.children || !this.children.length) return;
    this.children.forEach((child) => {
      child.traverse(callback);
    });
  }
}
