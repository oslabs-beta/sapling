import { getNonce, getUUID } from '../helpers';

// React component tree is a nested data structure, children are Trees
export default class TreeItem {
  [key: string]: TreeItem[keyof TreeItem];
  readonly id: string; // nonce is sufficient, as it will be hashed again as object key
  readonly uuid: string; // unique identifier shared between duplicate nodes
  readonly filePath: string;
  fileName: string;
  name: string;
  importPath: string;
  isExpanded: boolean;
  isAllExpanded: boolean;
  depth: number;
  isThirdParty: boolean;
  isReactRouter: boolean;
  hasReduxConnect: boolean;
  readonly childrenIds: string[];
  parentId: string;
  readonly ancestorIds: string[];
  props: Record<string, boolean>;
  error: '' | 'File not found.' | 'Error while processing this file/node';

  constructor(node?: Partial<TreeItem>) {
    this.id = getNonce(); // every node instance requires separate access key
    this.uuid = node?.uuid || getUUID();
    this.filePath = node?.filePath || '';
    this.fileName = node?.fileName || '';
    this.name = node?.name || '';
    this.importPath = node?.importPath || '';
    this.isExpanded = node?.isExpanded || false;
    this.isAllExpanded = node?.isAllExpanded || false;
    this.depth = node?.depth || 0;
    this.isThirdParty = node?.isThirdParty || false;
    this.isReactRouter = node?.isReactRouter || false;
    this.hasReduxConnect = node?.hasReduxConnect || false;
    this.childrenIds = node?.childrenIds || new Array<string>();
    this.parentId = node?.parentId || '';
    this.ancestorIds = node?.ancestorIds || new Array<string>();
    this.props = node?.props || {};
    this.error = node?.error || '';
  }

  public set(key: string, value: TreeItem[keyof TreeItem]): void {
    this[key] = value;
  }
  public numChildren(): number {
    return this.childrenIds.length;
  }
  public isFile(): boolean {
    return !this.isThirdParty && !this.isReactRouter;
  }
  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
  public toggleAllExpanded(): void {
    this.isAllExpanded = !this.isAllExpanded;
    this.isExpanded = this.isAllExpanded;
  }
}
