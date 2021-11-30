import TreeItem from './TreeItem';

export default class ComponentTree {
  private _rootId: string;
  private readonly _nodesById: Record<string, TreeItem>;

  constructor(root?: TreeItem, store?: Record<string, TreeItem>) {
    this._rootId = root?.id || '';
    this._nodesById = store || {};
    if (root) this._nodesById[root.id] = root;
  }

  public get root(): TreeItem {
    return this._nodesById[this._rootId];
  }

  /** @returns collection of all nodes in component tree */
  public get store(): Record<string, TreeItem> {
    return this._nodesById;
  }

  /** @returns normalized array of all nodes with root node at index 0 */
  public get storeArray(): Array<TreeItem> {
    return [
      this.root,
      ...Object.values(this._nodesById).filter((node) => node.id !== this._rootId),
    ];
  }

  public get(id: string): TreeItem {
    return this._nodesById[id];
  }

  // append input node to store
  public set(node: TreeItem): void {
    if (this.isEmpty()) this._rootId = node.id;
    this._nodesById[node.id] = node;
  }

  public isEmpty(): boolean {
    return this._rootId === '' || Object.keys(this.store).length === 0;
  }

  public get size(): number {
    return Object.keys(this.store).length;
  }

  public getChildren(parentId: string): Array<TreeItem> {
    return this.get(parentId).childrenIds.map((id) => this.get(id));
  }

  // Traverses the tree and changes expanded property of node whose id matches provided id
  public findAndToggleExpanded(id: string): void {
    this.get(id).toggleExpanded();
    // if node is expanded after toggle, also expand all ancestors
    Object.keys(this.get(id).ancestorIds).forEach((key) => {
      this.get(key).toggleExpanded();
    });
  }

  // expandAll/collapseAll feature: issue #97
  public toggleAllExpanded(): void {
    Object.entries(this.store).forEach(([id, subtree]) => {
      this.get(id).set('isExpanded', !subtree.isAllExpanded);
      this.get(id).set('isAllExpanded', !subtree.isAllExpanded);
    });
  }

  /** method for accessing nested nodes (for parser testing module)
   * @params traversalOrder:
   * each element in the array at index i specifies the index of the next child to traverse to
   * as found in the childrenIds array of the parent node at depth i+1
   * e.g. [0] would be the first child of root
   * e.g. [0, 2, 1] would describe the second child of the third child of the first child of the root node
   * @returns the TreeItem node found at the end of this traversal path
   * if there is no input parameter or its length is 0, returns root node
   */
  public getNodeByPath(...traversalOrder: number[]): TreeItem {
    if (!traversalOrder || !traversalOrder.length) return this.root;
    return this.get(
      traversalOrder.reduce((acc, childInsertOrder: number) => {
        return this.getChildren(acc)[childInsertOrder].id;
      }, this.root.id)
    );
  }

  // Recursively traverses subtree with specified input node as root,
  // applies callback to all visited nodes, and updates store state
  public traverseAndApply(startNodeId: string, callback: (node: TreeItem) => TreeItem): void {
    if (!startNodeId || !this.get(startNodeId)) return;
    const startNode = this.get(startNodeId);
    const newNode = callback(startNode);
    this.set(newNode);
    if (!newNode.childrenIds.length) return;
    newNode.childrenIds.forEach((id) => this.traverseAndApply(id, callback));
  }
}
