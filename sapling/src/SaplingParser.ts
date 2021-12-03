import * as babelParser from '@babel/parser';
import * as path from 'path';
import * as fs from 'fs';
import * as cabinet from 'filing-cabinet';
import { create as ResolverCreator } from 'enhanced-resolve';

import { filePathFixer } from './helpers/filePathFixer';
import { getNonce } from './helpers/getNonce';

import { File } from '@babel/types';
import { Tree } from './types/Tree';
import { ImportObj } from './types/ImportObj';
import { SaplingSettings } from './types/SaplingSettings';

const defaultSettings = {
  useAlias: false,
  appRoot: '',
  webpackConfig: '',
  tsConfig: '',
};

export class SaplingParser {
  entryFile: string;
  settings: SaplingSettings;
  tree: Tree | undefined;
  aliases: string[];
  wpResolver: Function | undefined;

  constructor(
    filePath: string,
    settings: SaplingSettings = { ...defaultSettings }
  ) {
    if (filePath) {
      // Ensure correct file path for root file when selected in webview:
      this.entryFile = filePathFixer(filePath);
    } else {
      this.entryFile = '';
    }

    // Set parser settings on new instance of parser
    this.settings = settings;

    // If settings include webpack Config, try to create resolver
    if (this.settings.webpackConfig) {
      this.createWpResolver();
    }

    this.aliases = [];
    this.updateAliases();

    this.tree = undefined;
  }

  // Set a new entryFile for the parser (root of component hierarchy)
  public setEntryFile(filePath: string) {
    this.entryFile = filePathFixer(filePath);
  }

  // Update parser settings when changed in webview
  public updateSettings(setting: string, value: boolean | string): void {
    this.settings = { ...this.settings, [setting]: value };
    if (setting === 'webpackConfig') {
      this.createWpResolver();
    }
    this.updateAliases();
  }

  // Returns true if current settings are valid for parsing otherwise false
  public validSettings(): boolean {
    if (!this.entryFile) {
      return false;
    }

    if (
      !this.settings.useAlias ||
      (this.settings.useAlias && this.settings.appRoot)
    ) {
      return true;
    }
    return false;
  }

  // Public method to generate component tree based on current entryFile
  public parse(): Tree {
    // Create root Tree node
    const root = {
      id: getNonce(),
      name: path.basename(this.entryFile).replace(/\.(t|j)sx?$/, ''),
      fileName: path.basename(this.entryFile),
      filePath: this.entryFile,
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
      error: '',
    };

    this.tree = root;
    this.parser(root);
    console.log('Parsed Tree is: ', this.tree);
    return this.tree;
  }

  public getTree(): Tree | undefined {
    return this.tree;
  }

  // Set Sapling Parser with a specific Data Tree (from workspace state)
  public setTree(tree: Tree): void {
    this.entryFile = tree.filePath;
    this.tree = tree;
  }

  // Updates the tree when a file is saved in VS Code
  public updateTree(filePath: string): Tree | undefined {
    if (this.tree === undefined) {
      return this.tree;
    }

    type ChildInfo = {
      depth: number;
      filePath: string;
      expanded: boolean;
    };

    let children: Array<ChildInfo> = [];

    const getChildNodes = (node: Tree): void => {
      const { depth, filePath, expanded } = node;
      children.push({ depth, filePath, expanded });
    };

    const matchExpand = (node: Tree): void => {
      for (let i = 0; i < children.length; i += 1) {
        const oldNode = children[i];
        if (
          oldNode.depth === node.depth &&
          oldNode.filePath === node.filePath &&
          oldNode.expanded
        ) {
          node.expanded = true;
        }
      }
    };

    const callback = (node: Tree): void => {
      if (node.filePath === filePath) {
        node.children.forEach((child) => {
          this.traverseTree(getChildNodes, child);
        });

        const newNode = this.parser(node);

        this.traverseTree(matchExpand, newNode);

        children = [];
      }
    };

    this.traverseTree(callback, this.tree);

    return this.tree;
  }

  // Traverses the tree and changes expanded property of node whose id matches provided id
  public toggleNode(id: string, expanded: boolean): Tree | undefined {
    const callback = (node: Tree) => {
      if (node.id === id) {
        node.expanded = expanded;
      }
    };

    this.traverseTree(callback, this.tree);

    return this.tree;
  }

  // Method to create enhanced-resolve resolver for webpack aliases
  private createWpResolver(): void {
    // Try to open provided webpack config file:
    let webpackObj;
    try {
      webpackObj = require(path.resolve(this.settings.webpackConfig));
      console.log('Webpack file is: ', webpackObj);

      // Create new resolver to handle webpack aliased imports:
      this.wpResolver = ResolverCreator.sync({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        ...webpackObj.resolve,
      });
    } catch (err) {
      console.log('Error while trying to load webpack config: ', err);
      this.wpResolver = undefined;
    }
  }

  // Method that extracts all aliases from tsconfig and webpack config files for parsing
  private updateAliases(): void {
    const aliases = [];
    if (this.settings.tsConfig) {
      // Try to open tsConfig file, if error then alert user in webview:
      let tsConfig;
      try {
        tsConfig = fs.readFileSync(
          path.resolve(this.settings.tsConfig),
          'utf-8'
        );
        // Strip any comments from the JSON before parsing:
        tsConfig = tsConfig.replace(
          /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
          (m, g) => (g ? '' : m)
        );
        tsConfig = JSON.parse(tsConfig);
      } catch (err) {
        this.settings.tsConfig = 'Error - could not open tsConfig!';
      }

      // If tsConfig contains path aliases, add aliases to parser aliases
      if (
        typeof tsConfig === 'object' &&
        tsConfig.compilerOptions &&
        tsConfig.compilerOptions.paths
      ) {
        for (let key of Object.keys(tsConfig.compilerOptions.paths)) {
          // Remove asterix from end of alias if present
          key =
            key[key.length - 1] === '*' ? key.slice(0, key.length - 1) : key;
          if (key) {
            aliases.push(key);
          }
        }
      }
    }

    // Extract any webpack aliases for parsing
    if (this.settings.webpackConfig && this.wpResolver) {
      console.log('TRYING TO GET webpack aliases!!');
      let wpObj;
      try {
        wpObj = require(this.settings.webpackConfig);
      } catch (err) {
        this.settings.webpackConfig = 'Error - could not import webpackConfig!';
      }
      if (typeof wpObj === 'object' && wpObj.resolve && wpObj.resolve.alias) {
        for (let key of Object.keys(wpObj.resolve.alias)) {
          key =
            key[key.length - 1] === '$' ? key.slice(0, key.length - 1) : key;
          if (key) {
            aliases.push(key);
          }
        }
      }
    }

    console.log('aliases are: ', aliases);
    this.aliases = aliases;
  }

  // Traverses all nodes of current component tree and applies callback to each node
  private traverseTree(
    callback: Function,
    node: Tree | undefined = this.tree
  ): void {
    if (!node) {
      return;
    }

    callback(node);

    node.children.forEach((childNode) => {
      this.traverseTree(callback, childNode);
    });
  }

  // Recursively builds the React component tree structure starting from root node
  private parser(componentTree: Tree): Tree {
    // If import is a node module, do not parse any deeper
    if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
      // Check that import path is not an aliased import
      let thirdParty = true;

      for (let alias of this.aliases) {
        if (componentTree.importPath.indexOf(alias) === 0) {
          thirdParty = false;
          break;
        }
      }

      if (thirdParty) {
        componentTree.thirdParty = true;
        if (
          componentTree.fileName === 'react-router-dom' ||
          componentTree.fileName === 'react-router'
        ) {
          componentTree.reactRouter = true;
        }
        return componentTree;
      }
    }

    // Check that file has valid fileName/Path, if not found, add error to node and halt
    const fileName = this.getFileName(componentTree);
    console.log('File path is: ', fileName);
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
      ast = babelParser.parse(
        fs.readFileSync(path.resolve(componentTree.filePath), 'utf-8'),
        {
          sourceType: 'module',
          tokens: true,
          plugins: ['jsx', 'typescript'],
        }
      );

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
    componentTree.children = this.getJSXChildren(
      ast.tokens,
      imports,
      componentTree
    );

    // Check if current node is connected to the Redux store
    componentTree.reduxConnect = this.checkForRedux(ast.tokens, imports);

    // Recursively parse all child components
    componentTree.children.forEach((child) => this.parser(child));

    return componentTree;
  }

  // Finds files where import string does not include a file extension
  private getFileName(componentTree: Tree): string | null {
    console.log('trying to get filename: ', componentTree);

    // If import aliasing is in use, correctly resolve file path with filing cabinet / enhanced resolve for non-root node files:
    if (this.settings.useAlias && componentTree.parentList.length) {
      let result;
      if (this.settings.tsConfig) {
        console.log('Using filing cabinet to resolve alias!');
        try {
          const options = {
            partial: componentTree.importPath,
            directory: this.settings.appRoot,
            filename: componentTree.parentList[0],
            tsConfig: this.settings.tsConfig,
          };

          result = cabinet(options);
          console.log('Cabinet result is: ', result);
        } catch (err) {
          return '';
        }
      }

      // Otherwise try webpack aliases if present:
      if (!result && this.settings.webpackConfig && this.wpResolver) {
        result = this.wpResolver(
          this.settings.appRoot,
          componentTree.importPath
        );
      }

      console.log('result is: ', result);
      if (
        !result ||
        path.basename(result) === `index.${path.extname(result)}`
      ) {
        throw new Error('index pattern');
      }

      componentTree.filePath = result;
      return result;
    }

    // Otherwise find correct JS/JSX/TS/TSX file with no aliasing if it exists
    const ext = path.extname(componentTree.filePath);
    if (!ext) {
      // Try and find file extension that exists in directory:
      try {
        const fileArray = fs.readdirSync(path.dirname(componentTree.filePath));
        const regEx = new RegExp(`${componentTree.fileName}.(j|t)sx?$`);
        let fileName = fileArray.find((fileStr) => fileStr.match(regEx));
        return fileName
          ? (componentTree.filePath += path.extname(fileName))
          : null;
      } catch (err) {
        console.log('Error trying to find specified file: ', err);
        return null;
      }
    } else {
      return componentTree.fileName;
    }
  }

  // Extracts Imports from current file
  // const Page1 = lazy(() => import('./page1')); -> is parsed as 'ImportDeclaration'
  // import Page2 from './page2'; -> is parsed as 'VariableDeclaration'
  private getImports(body: { [key: string]: any }[]): ImportObj {
    const bodyImports = body.filter(
      (item) => item.type === 'ImportDeclaration' || 'VariableDeclaration'
    );
    // console.log('bodyImports are: ', bodyImports);
    return bodyImports.reduce((accum, curr) => {
      // Import Declarations:
      if (curr.type === 'ImportDeclaration') {
        curr.specifiers.forEach((i: { [key: string]: any }) => {
          accum[i.local.name] = {
            importPath: curr.source.value,
            importName: i.imported ? i.imported.name : i.local.name,
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
            importName,
          };
        }
      }
      return accum;
    }, {});
  }

  // Recursive helper method to find import path in Variable Declaration
  private findVarDecImports(ast: { [key: string]: any }): string | boolean {
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
  private getJSXChildren(
    astTokens: any[],
    importsObj: ImportObj,
    parentNode: Tree
  ): Tree[] {
    let childNodes: { [key: string]: Tree } = {};
    let props: { [key: string]: boolean } = {};
    let token: { [key: string]: any };

    for (let i = 0; i < astTokens.length; i++) {
      // Case for finding JSX tags eg <App .../>
      if (
        astTokens[i].type.label === 'jsxTagStart' &&
        astTokens[i + 1].type.label === 'jsxName' &&
        importsObj[astTokens[i + 1].value]
      ) {
        token = astTokens[i + 1];
        props = this.getJSXProps(astTokens, i + 2);
        childNodes = this.getChildNodes(
          importsObj,
          token,
          props,
          parentNode,
          childNodes
        );

        // Case for finding components passed in as props e.g. <Route component={App} />
      } else if (
        astTokens[i].type.label === 'jsxName' &&
        (astTokens[i].value === 'component' ||
          astTokens[i].value === 'children') &&
        importsObj[astTokens[i + 3].value]
      ) {
        token = astTokens[i + 3];
        childNodes = this.getChildNodes(
          importsObj,
          token,
          props,
          parentNode,
          childNodes
        );
      }
    }

    return Object.values(childNodes);
  }

  private getChildNodes(
    imports: ImportObj,
    astToken: { [key: string]: any },
    props: { [key: string]: boolean },
    parent: Tree,
    children: { [key: string]: Tree }
  ): { [key: string]: Tree } {
    if (children[astToken.value]) {
      children[astToken.value].count += 1;
      children[astToken.value].props = {
        ...children[astToken.value].props,
        ...props,
      };
    } else {
      // Add tree node to childNodes if one does not exist
      children[astToken.value] = {
        id: getNonce(),
        name: imports[astToken.value]['importName'],
        fileName: path.basename(imports[astToken.value]['importPath']),
        filePath: path.resolve(
          path.dirname(parent.filePath),
          imports[astToken.value]['importPath']
        ),
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
  private getJSXProps(
    astTokens: { [key: string]: any }[],
    j: number
  ): { [key: string]: boolean } {
    const props: { [key: string]: boolean } = {};
    while (astTokens[j].type.label !== 'jsxTagEnd') {
      if (
        astTokens[j].type.label === 'jsxName' &&
        astTokens[j + 1].value === '='
      ) {
        props[astTokens[j].value] = true;
      }
      j += 1;
    }
    return props;
  }

  // Checks if current Node is connected to React-Redux Store
  private checkForRedux(astTokens: any[], importsObj: ImportObj): boolean {
    // Check that react-redux is imported in this file (and we have a connect method or otherwise)
    let reduxImported = false;
    let connectAlias;
    Object.keys(importsObj).forEach((key) => {
      if (
        importsObj[key].importPath === 'react-redux' &&
        importsObj[key].importName === 'connect'
      ) {
        reduxImported = true;
        connectAlias = key;
      }
    });

    if (!reduxImported) {
      return false;
    }

    // Check that connect method is invoked and exported in the file
    for (let i = 0; i < astTokens.length; i += 1) {
      if (
        astTokens[i].type.label === 'export' &&
        astTokens[i + 1].type.label === 'default' &&
        astTokens[i + 2].value === connectAlias
      ) {
        return true;
      }
    }
    return false;
  }
}
