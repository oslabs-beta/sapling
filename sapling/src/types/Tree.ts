import { getNonce } from '../helpers/getNonce';
import { SaplingParser } from '../SaplingParser';

export interface SerializedTree {
  [key: string]: unknown;
  readonly type: 'SerializedTree';
  readonly id: string;
  readonly name: string;
  readonly fileName: string;
  readonly filePath: string;
  readonly importPath: string;
  readonly depth: number;
  readonly count: number;
  readonly isExpanded: boolean;
  readonly isThirdParty: boolean;
  readonly isReactRouter: boolean;
  readonly hasReduxConnect: boolean;
  readonly children: Array<SerializedTree>;
  readonly parentId: string | null | undefined;
  readonly parentList: string[];
  readonly props: Record<string, boolean>;
  readonly error: '' | 'File not found.' | 'Error while processing this file/node.';
}

export class Tree {
  [key: string]: unknown;
  readonly type = 'Tree';
  private readonly _id: string;
  private readonly _name: string;
  private readonly _fileName: string;
  private readonly _filePath: string;
  private readonly _importPath: string;
  private _depth: number;
  private _count: number;
  private _isExpanded: boolean;
  private _isThirdParty: boolean;
  private _isReactRouter: boolean;
  private _hasReduxConnect: boolean;
  private readonly _children: Array<Tree>;
  private readonly _parentId: string | null | undefined;
  private readonly _parentList: string[];
  private readonly _props: Record<string, boolean>;
  private _error: '' | 'File not found.' | 'Error while processing this file/node.';

  constructor(node?: Partial<Tree>) {
    this._id = getNonce(); // shallow copies made from constructor do not share identifiers
    this._name = node?.name || '';
    this._fileName = node?.fileName || '';
    this._filePath = node?.filePath || '';
    this._importPath = node?.importPath || '';
    this._depth = node?.depth || 0;
    this._count = node?.count || 1;
    this._isExpanded = node?.isExpanded || false;
    this._isThirdParty = node?.isThirdParty || false;
    this._isReactRouter = node?.isReactRouter || false;
    this._hasReduxConnect = node?.hasReduxConnect || false;
    this._children = node?.children || [];
    this._parentId = node?.parentId;
    this._parentList = node?.parentList || [];
    this._props = node?.props || {};
    this._error = node?.error || '';
  }

  /** All class fields are accessible using member expressions.
   * To prevent read access to a field, remove its getter method. */

  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get fileName(): string {
    return this._fileName;
  }
  public get filePath(): string {
    return this._filePath;
  }
  public get importPath(): string {
    return this._importPath;
  }
  public get depth(): number {
    return this._depth;
  }
  public get count(): number {
    return this._count;
  }
  public get isExpanded(): boolean {
    return this._isExpanded;
  }
  public get isThirdParty(): boolean {
    return this._isThirdParty;
  }
  public get isReactRouter(): boolean {
    return this._isReactRouter;
  }
  public get hasReduxConnect(): boolean {
    return this._hasReduxConnect;
  }
  public get children(): Array<Tree> {
    return this._children;
  }
  public get parentId(): string | null | undefined {
    return this._parentId;
  }
  public get parentList(): string[] {
    return this._parentList;
  }
  public get props(): Record<string, boolean> {
    return this._props;
  }
  public get error(): '' | 'File not found.' | 'Error while processing this file/node.' {
    return this._error;
  }

  /** Sets or modifies value of class fields and performs input validation.
   * Direct assignment of class fields using member expressions is not allowed.
   * @param key The class field to be modified.
   * @param value The value to be assigned.
   * Defines unalterable class fields: 'isExpanded', 'id', 'name', ' fileName', 'filePath', 'importPath', 'parentId', 'parentList'.
   * Use for complete replacement of 'children', 'props' elements (for mutation, use array/object methods).
   */
  public set(key: keyof Tree, value: Tree[keyof Tree]): void {
    if (key === 'children') {
      if (value && Array.isArray(value) && (!value.length || value[0] instanceof Tree)) {
        this._children.splice(0, this._children.length);
        this._children.push(...(value as Array<Tree>));
        return;
      }
      throw new Error('Invalid input children array.');
    }
    if (key === 'props') {
      if (
        value &&
        typeof value === 'object' &&
        Object.entries(value).every(([k, v]) => typeof k === 'string' && typeof v === 'boolean')
      ) {
        Object.keys(this._props).forEach((k) => delete this._props[k]);
        Object.entries(value).forEach(([k, v]: [string, boolean]) => (this._props[k] = v));
        return;
      }
      throw new Error('Invalid input props object.');
    }
    if (
      [
        'id',
        'name',
        'fileName',
        'filePath',
        'importPath',
        'parentId',
        'parentList',
        'isExpanded',
      ].includes(key as string)
    ) {
      throw new Error(`Altering property ${key} is not allowed. Create new tree instance instead.`);
    } else this[`_${key}`] = value;
  }

  /** Finds tree node(s) and returns reference pointer.
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
   * @returns Tree node found at the destination of input traversal path.
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
    } else if (typeof input[0] === 'string') {
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

  /** @returns Normalized array containing current node and all of its descendants. */
  public get subtree(): Array<Tree> {
    const descendants: Array<Tree> = [];
    const callback = (node: Tree) => {
      descendants.push(...node.children);
    };
    this.traverse(callback);
    return [this, ...descendants];
  }

  /** Recursively applies callback on current node and all of its descendants. */
  public traverse(callback: (node: Tree) => void): void {
    callback(this);
    if (!this.children || !this.children.length) return;
    this.children.forEach((child) => {
      child.traverse(callback);
    });
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
  public toggleExpanded(): void {
    this._isExpanded = !this._isExpanded;
  }

  /** Finds subtree node and changes isExpanded property state.
   * @param expandedState if not undefined, defines value of isExpanded property for target node.
   * If expandedState is undefined, isExpanded property is negated.
   */
  public findAndToggleExpanded(id: string, expandedState?: boolean): void {
    const target = this.get(id) as Tree | undefined;
    if (target === undefined) throw new Error('Invalid input id.');
    // If expandedState is undefined, predicate will always evaluate to true due to type difference.
    if (target.isExpanded !== expandedState) target.toggleExpanded();
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
        return { isExpanded: node.isExpanded, depth: node.depth, filePath: node.filePath };
      });

      // Subtree of target is newly parsed in-place.
      SaplingParser.parse(target);

      const restoreExpanded = (node: Tree): void => {
        if (
          node.isExpanded !==
          prevState.some(
            ({ isExpanded, depth, filePath }) =>
              isExpanded && node.depth === depth && node.filePath === filePath
          )
        ) {
          node.toggleExpanded();
        }
      };
      target.traverse(restoreExpanded);
    });
  }

  /** Recursively captures and exports internal state for all nested nodes.
   * Required for lossless conversion to/from workspaceState memento object (webview persistence).
   * @returns JSON-stringifyable SerializedTree object
   */
  public serialize(): SerializedTree {
    const recurse = (node: Tree): SerializedTree => {
      const obj = {
        ...node,
        _type: 'SerializedTree',
        _children: node.children.map((child) => recurse(child)),
      };
      return Object.entries(obj).reduce((acc, [k, v]) => {
        acc[k.slice(1)] = v;
        return acc;
      }, {} as SerializedTree);
    };
    return recurse(this);
  }

  /** Recursively converts all nested node data in SerializedTree object into Tree class objects.
   * @param data: SerializedTree Object containing state data for all nodes in component tree to be restored into webview.
   * @returns Tree class object with all nested descendant nodes also of Tree class.
   */
  public static deserialize(data: SerializedTree): Tree {
    const recurse = (node: SerializedTree): Tree =>
      new Tree({
        ...node,
        type: 'Tree',
        children: node.children.map((child) => recurse(child)),
      });
    return recurse(data);
  }
}
