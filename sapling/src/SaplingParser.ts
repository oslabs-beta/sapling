import * as babelParser from '@babel/parser';
import * as path from 'path';
import * as fs from 'fs';
import * as cabinet from 'filing-cabinet';
import { File } from '@babel/types';

import { filePathFixer } from './helpers/filePathFixer';
import { getNonce } from './helpers/getNonce';
import { Tree } from './types/Tree';
import { ImportObj } from './types/ImportObj';

const defaultOptions = {
  useAlias: false,
  appRoot: '',
  webpackConfig: '',
  tsConfig: '',
};


export class SaplingParser {
  entryFile: string;
  useAlias: boolean;
  appRoot: string;
  webpackConfig: string;
  tsConfig: string;
  tree: Tree | undefined;

  constructor(filePath: string, options = {...defaultOptions}) {
    // Ensure correct file path for root file when selected in webview:
    this.entryFile = filePathFixer(filePath);

    this.useAlias = options.useAlias;
    this.appRoot = options.appRoot;
    this.webpackConfig = options.webpackConfig;
    this.tsConfig = options.tsConfig;
    this.tree = undefined;
  }

  public setUseAlias(useAlias: boolean) : void {
    this.useAlias = useAlias;
  }

  public setAppRoot(appRoot: string) : void {
    this.appRoot = filePathFixer(appRoot);
  }

  public setWpConfig(webpackConfig: string) : void {
    this.webpackConfig = filePathFixer(webpackConfig);
  }

  public setTsConfig(tsConfig: string) : void {
    this.tsConfig = filePathFixer(tsConfig);
  }

  // Public method to generate component tree based on current entryFile
  public parse() : Tree {
    // Create root Tree node
    const root = {
      id: getNonce(),
      name: path.basename(this.entryFile).replace(/\.(t|j)sx?$/, ''),
      fileName: path.basename(this.entryFile),
      filePath : this.entryFile,
      importPath: '/', // this.entryFile here breaks windows file path on root e.g. C:\\ is detected as third party
      expanded: false,
      depth: 0,
      count: 1,
      thirdParty: false,
      reactRouter: false,
      reduxConnect: false,
      children: [],
      parentList: [],
      props: {},
      error: ''
    };

    this.tree = root;
    this.parser(root);
    return this.tree;
  }

  public getTree() : Tree | undefined {
    return this.tree;
  }

  // Set Sapling Parser with a specific Data Tree (from workspace state)
  public setTree(tree : Tree) : void {
    this.entryFile = tree.filePath;
    this.tree = tree;
  }

  // Updates the tree when a file is saved in VS Code
  public updateTree(filePath : string) : Tree | undefined {
      if (this.tree === undefined) {
        return this.tree;
      }

      type ChildInfo = {
        depth: number,
        filePath: string,
        expanded: boolean
      };

      let children : Array<ChildInfo> = [];

      const getChildNodes = (node: Tree) : void => {
        const { depth, filePath, expanded } = node;
        children.push({ depth, filePath, expanded });
      };

      const matchExpand = (node: Tree) : void => {
        for (let i = 0 ; i < children.length ; i += 1) {
          const oldNode = children[i];
            if (oldNode.depth === node.depth && oldNode.filePath === node.filePath && oldNode.expanded) {
              node.expanded = true;
            }
        }
      };

      const callback = (node: Tree) : void => {
        if (node.filePath === filePath) {
          node.children.forEach(child => {
            this.#traverseTree(getChildNodes, child);
          });

          const newNode = this.parser(node);

          this.#traverseTree(matchExpand, newNode);

          children = [];
        }
      };

      this.#traverseTree(callback, this.tree);

      return this.tree;
    }

  // Traverses the tree and changes expanded property of node whose id matches provided id
  public toggleNode(id : string, expanded : boolean) : Tree | undefined {
    const callback = (node : Tree) => {
      if (node.id === id) {
        node.expanded = expanded;
      }
    };

    this.#traverseTree(callback, this.tree);

    return this.tree;
  }

  // Traverses all nodes of current component tree and applies callback to each node
  #traverseTree(callback : Function, node : Tree | undefined = this.tree) : void {
    if (!node) {
      return;
    }

    callback(node);

    node.children.forEach( (childNode) => {
      this.#traverseTree(callback, childNode);
    });
  }

  // Recursively builds the React component tree structure starting from root node
  private parser(componentTree: Tree) : Tree {

    // If import is a node module, do not parse any deeper
    if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
      componentTree.thirdParty = true;
      if (componentTree.fileName === 'react-router-dom' || componentTree.fileName === 'react-router') {
        componentTree.reactRouter = true;
      }
      return componentTree;
    }

    // Check that file has valid fileName/Path, if not found, add error to node and halt
    const fileName = this.getFileName(componentTree);
    if (!fileName) {
      componentTree.error = 'File not found.';
      return componentTree;
    }

    // If current node recursively calls itself, do not parse any deeper:
    if (componentTree.parentList.includes(componentTree.filePath)) {
      return componentTree;
    }

    // Create abstract syntax tree of current component tree file
    let ast: babelParser.ParseResult<File>;
    try {
      ast = babelParser.parse(fs.readFileSync(path.resolve(componentTree.filePath), 'utf-8'), {
        sourceType: 'module',
        tokens: true,
        plugins: [
          'jsx',
          'typescript',
        ]
      });

      // If no ast or ast tokens, error when parsing file
      if (!ast || !ast.tokens) {
        throw new Error();
      }
    } catch (err) {
      componentTree.error = 'Error while processing this file/node';
      return componentTree;
    }

    // Find imports in the current file, then find child components in the current file
    const imports = this.getImports(ast.program.body);

    // Get any JSX Children of current file:
    componentTree.children = this.getJSXChildren(ast.tokens, imports, componentTree);

    // Check if current node is connected to the Redux store
    componentTree.reduxConnect = this.checkForRedux(ast.tokens, imports);

    // Recursively parse all child components
    componentTree.children.forEach(child => this.parser(child));

    return componentTree;
  }

  // Finds files where import string does not include a file extension
  private getFileName(componentTree: Tree) : string | null {
    const ext = path.extname(componentTree.filePath);

    // If import aliasing is in use, correctly resolve file path with filing cabinet:
    if (this.useAlias) {
        try {
          const options : {partial: string, directory: string, filename: string,[key: string]: string} = {
            partial: componentTree.importPath,
            directory: this.appRoot,
            filename: componentTree.parentList[0],
            tsConfig: this.tsConfig,
            webpackConfig: this.webpackConfig
          };

          const result = cabinet(options);
          if (!result || path.basename(result) === `index.${path.extname(result)}`){
            throw new Error ('index pattern');
          }

          return result;

        } catch (err) {
          return '';
        }
    }

    // Otherwise find correct JS/JSX/TS/TSX file if it exists
    if (!ext) {
      // Try and find file extension that exists in directory:
      const fileArray = fs.readdirSync(path.dirname(componentTree.filePath));
      const regEx = new RegExp(`${componentTree.fileName}.(j|t)sx?$`);
      let fileName = fileArray.find(fileStr => fileStr.match(regEx));
      return fileName ? componentTree.filePath += path.extname(fileName) : null;
    } else {
      return componentTree.fileName;
    }
  }

  // Extracts Imports from current file
  // const Page1 = lazy(() => import('./page1')); -> is parsed as 'ImportDeclaration'
  // import Page2 from './page2'; -> is parsed as 'VariableDeclaration'
  private getImports(body : {[key : string]: any}[]) : ImportObj {
    const bodyImports = body.filter(item => item.type === 'ImportDeclaration' || 'VariableDeclaration');
    // console.log('bodyImports are: ', bodyImports);
    return bodyImports.reduce((accum, curr) => {
      // Import Declarations:
      if (curr.type === 'ImportDeclaration') {
        curr.specifiers.forEach((i : {[key : string]: any}) => {
          accum[i.local.name] = {
            importPath: curr.source.value,
            importName: (i.imported)? i.imported.name : i.local.name
          };
        });
      }
      // Imports Inside Variable Declarations: // Not easy to deal with nested objects
      if (curr.type === 'VariableDeclaration') {
        const importPath = this.findVarDecImports(curr.declarations[0]);
        if (importPath) {
          const importName = curr.declarations[0].id.name;
          accum[curr.declarations[0].id.name] = {
            importPath,
            importName
          };
        }
      }
      return accum;
    }, {});
  }

  // Recursive helper method to find import path in Variable Declaration
  private findVarDecImports(ast: {[key: string]: any}) : string | boolean {
    // Base Case, find import path in variable declaration and return it,
    if (ast.hasOwnProperty('callee') && ast.callee.type === 'Import') {
      return ast.arguments[0].value;
    }

    // Otherwise look for imports in any other non null/undefined objects in the tree:
    for (let key in ast) {
      if (ast.hasOwnProperty(key) && typeof ast[key] === 'object' && ast[key]) {
        const importPath = this.findVarDecImports(ast[key]);
        if (importPath) {
          return importPath;
        }
      }
    }

    return false;
  }

  // Finds JSX React Components in current file
  private getJSXChildren(astTokens: any[], importsObj : ImportObj, parentNode: Tree) : Tree[] {
    let childNodes: {[key : string]: Tree} = {};
    let props : {[key : string]: boolean} = {};
    let token : {[key: string]: any};

    for (let i = 0; i < astTokens.length; i++) {
      // Case for finding JSX tags eg <App .../>
      if (astTokens[i].type.label === 'jsxTagStart'
      && astTokens[i + 1].type.label === 'jsxName'
      && importsObj[astTokens[i + 1].value]) {
        token = astTokens[i + 1];
        props = this.getJSXProps(astTokens, i + 2);
        childNodes = this.getChildNodes(importsObj, token, props, parentNode, childNodes);

        // Case for finding components passed in as props e.g. <Route component={App} />
      } else if (astTokens[i].type.label === 'jsxName'
      && (astTokens[i].value === 'component' || astTokens[i].value === 'children')
      && importsObj[astTokens[i + 3].value]) {
        token = astTokens[i + 3];
        childNodes = this.getChildNodes(importsObj, token, props, parentNode, childNodes);
      }
    }

    return Object.values(childNodes);
  }

  private getChildNodes(imports : ImportObj,
    astToken : {[key: string]: any}, props : {[key : string]: boolean},
    parent : Tree, children : {[key : string] : Tree}) : {[key : string] : Tree} {

    if (children[astToken.value]) {
      children[astToken.value].count += 1;
      children[astToken.value].props = {...children[astToken.value].props, ...props};
    } else {
      // Add tree node to childNodes if one does not exist
      children[astToken.value] = {
        id: getNonce(),
        name: imports[astToken.value]['importName'],
        fileName: path.basename(imports[astToken.value]['importPath']),
        filePath: path.resolve(path.dirname(parent.filePath), imports[astToken.value]['importPath']),
        importPath: imports[astToken.value]['importPath'],
        expanded: false,
        depth: parent.depth + 1,
        thirdParty: false,
        reactRouter: false,
        reduxConnect: false,
        count: 1,
        props: props,
        children: [],
        parentList: [parent.filePath].concat(parent.parentList),
        error: '',
      };
    }

    return children;
  }

  // Extracts prop names from a JSX element
  private getJSXProps(astTokens: {[key: string]: any}[], j : number) : {[key : string]: boolean} {
    const props : {[key : string]: boolean} = {};
    while (astTokens[j].type.label !== "jsxTagEnd") {
      if (astTokens[j].type.label === "jsxName" && astTokens[j + 1].value === "=") {
        props[astTokens[j].value] = true;
      }
      j += 1;
    }
    return props;
  }

  // Checks if current Node is connected to React-Redux Store
  private checkForRedux(astTokens: any[], importsObj : ImportObj) : boolean {
    // Check that react-redux is imported in this file (and we have a connect method or otherwise)
    let reduxImported = false;
    let connectAlias;
    Object.keys(importsObj).forEach( key => {
      if (importsObj[key].importPath === 'react-redux' && importsObj[key].importName === 'connect') {
        reduxImported = true;
        connectAlias = key;
      }
    });

    if (!reduxImported) {
      return false;
    }

    // Check that connect method is invoked and exported in the file
    for (let i = 0; i < astTokens.length; i += 1) {
      if (astTokens[i].type.label === 'export' && astTokens[i + 1].type.label === 'default' && astTokens[i + 2].value === connectAlias) {
        return true;
      }
    }
    return false;
  }
}
