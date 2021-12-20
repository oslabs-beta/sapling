/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as path from 'path';
import * as fs from 'fs';

import { parse as babelParse } from '@babel/parser';
import {
  Node as ASTNode,
  isIdentifier,
  isStringLiteral,
  isImportDeclaration,
  isVariableDeclaration,
  isImportSpecifier,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isCallExpression,
  isImport,
  isArrayPattern,
  isObjectPattern,
  isObjectProperty,
  ImportDeclaration,
  VariableDeclaration,
} from '@babel/types';
import { Tree, Token, ImportData } from './types';

export class SaplingParser {
  entryFile: string;
  tree: Tree | undefined;

  constructor(filePath: string) {
    // Fix when selecting files in wsl file system
    this.entryFile = filePath;
    if (process.platform === 'linux' && this.entryFile.includes('wsl$')) {
      this.entryFile = path.resolve(filePath.split(path.win32.sep).join(path.posix.sep));
      this.entryFile = '/' + this.entryFile.split('/').slice(3).join('/');
      // Fix for when running wsl but selecting files held on windows file system
    } else if (process.platform === 'linux' && /[a-zA-Z]/.test(this.entryFile[0])) {
      const root = `/mnt/${this.entryFile[0].toLowerCase()}`;
      this.entryFile = path.join(
        root,
        filePath.split(path.win32.sep).slice(1).join(path.posix.sep)
      );
    }

    this.tree = undefined;
    // Break down and reasemble given filePath safely for any OS using path?
  }

  // Public method to generate component tree based on current entryFile
  public parse(): Tree {
    // Create root Tree node
    const root = new Tree({
      name: path.basename(this.entryFile).replace(/\.[jt]sx?$/, ''),
      fileName: path.basename(this.entryFile),
      filePath: this.entryFile,
      importPath: '/', // this.entryFile here breaks windows file path on root e.g. C:\\ is detected as third party
      parentId: null,
    });

    this.tree = root;
    ASTParser.parser(root);
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
      // eslint-disable-next-line @typescript-eslint/no-shadow
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
          this.#traverseTree(getChildNodes, child);
        });

        const newNode = ASTParser.parser(node);

        this.#traverseTree(matchExpand, newNode);

        children = [];
      }
    };

    this.#traverseTree(callback, this.tree);

    return this.tree;
  }

  // Traverses the tree and changes expanded property of node whose id matches provided id
  public toggleNode(id: string, expanded: boolean): Tree | undefined {
    const callback = (node: Tree) => {
      if (node.id === id) {
        node.expanded = expanded;
      }
    };

    this.#traverseTree(callback, this.tree);

    return this.tree;
  }

  // Traverses all nodes of current component tree and applies callback to each node
  #traverseTree(callback: (node: Tree) => void, node: Tree | undefined = this.tree): void {
    if (!node) {
      return;
    }

    callback(node);

    node.children.forEach((childNode) => {
      this.#traverseTree(callback, childNode);
    });
  }
}

const ASTParser = {
  // Recursively builds the React component tree structure starting from root node
  parser(componentTree: Tree): Tree {
    // If import is a node module, do not parse any deeper
    if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
      componentTree.thirdParty = true;
      if (
        componentTree.fileName === 'react-router-dom' ||
        componentTree.fileName === 'react-router'
      ) {
        componentTree.reactRouter = true;
      }
      return componentTree;
    }

    // Check that file has valid fileName/Path, if not found, add error to node and halt
    if (!componentTree.importPath) {
      componentTree.error = 'File not found.';
      return componentTree;
    }

    // If current node recursively calls itself, do not parse any deeper:
    if (componentTree.parentList.includes(componentTree.filePath)) {
      return componentTree;
    }

    // Create abstract syntax tree of current component tree file
    let ast: ASTNode | Record<string, Array<Token>>;
    try {
      // See: https://babeljs.io/docs/en/babel-parser#options
      ast = babelParse(fs.readFileSync(path.resolve(componentTree.filePath), 'utf-8'), {
        sourceType: 'module',
        tokens: true, // default: false, tokens deprecated from babel v7
        plugins: ['jsx', 'typescript'],
        // TODO: additional plugins to look into supporting for future releases
        // 'importMeta': https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta
        // 'importAssertions': parses ImportAttributes type
        // https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#ImportAssertions
        allowImportExportEverywhere: true, // enables parsing dynamic imports
        attachComment: false, // performance benefits
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
    const imports = ImportParser.parse(ast.program.body);

    // Get any JSX Children of current file:
    componentTree.children.splice(0, componentTree.children.length);
    componentTree.children.push(...ASTParser.getJSXChildren(ast.tokens, imports, componentTree));

    // Check if current node is connected to the Redux store
    componentTree.reduxConnect = ASTParser.checkForRedux(ast.tokens, imports);

    // Recursively parse all child components
    componentTree.children.forEach((child) => ASTParser.parser(child));

    return componentTree;
  },

  validateFilePath(filePath: string): string {
    const fileArray: string[] = [];
    let parsedFileName = '';
    // Handles Next.js component and other third-party imports
    try {
      fileArray.push(...fs.readdirSync(path.dirname(filePath)));
    } catch {
      return filePath;
    }
    // Checks that file exists and appends file extension to path if not given in import declaration
    parsedFileName =
      fileArray.find((str) => new RegExp(`${path.basename(filePath)}\\.[jt]sx?$`).test(str)) || '';
    if (parsedFileName.length) return filePath + path.extname(parsedFileName);
    return filePath;
  },

  getChildNodes(
    imports: Record<string, ImportData>,
    astToken: Token,
    props: Record<string, boolean>,
    parent: Tree,
    children: Record<string, Tree>
  ): Record<string, Tree> {
    if (children[astToken.value]) {
      children[astToken.value].count += 1;
      Object.assign(children[astToken.value].props, props);
    } else {
      const moduleIdentifier = imports[astToken.value].importPath;
      const name = imports[astToken.value].importName;
      const filePath = ASTParser.validateFilePath(
        path.resolve(path.dirname(parent.filePath), moduleIdentifier)
      );
      // Add tree node to childNodes if one does not exist
      children[astToken.value] = new Tree({
        name,
        fileName: path.basename(filePath),
        filePath,
        importPath: moduleIdentifier,
        depth: parent.depth + 1,
        props,
        parentId: parent.id,
        parentList: [parent.filePath].concat(parent.parentList),
      });
    }
    return children;
  },

  // Finds JSX React Components in current file
  getJSXChildren(
    astTokens: Array<Token>,
    imports: Record<string, ImportData>,
    parentNode: Tree
  ): Array<Tree> {
    let childNodes: Record<string, Tree> = {};
    let props: Record<string, boolean> = {};
    let token: Token;

    for (let i = 0; i < astTokens.length; i++) {
      // Case for finding JSX tags eg <App .../>
      if (
        astTokens[i].type.label === 'jsxTagStart' &&
        astTokens[i + 1].type.label === 'jsxName' &&
        imports[astTokens[i + 1].value]
      ) {
        token = astTokens[i + 1];
        props = ASTParser.getJSXProps(astTokens, i + 2);
        childNodes = ASTParser.getChildNodes(imports, token, props, parentNode, childNodes);

        // Case for finding components passed in as props e.g. <Route component={App} />
      } else if (
        astTokens[i].type.label === 'jsxName' &&
        (astTokens[i].value === 'component' || astTokens[i].value === 'children') &&
        imports[astTokens[i + 3].value]
      ) {
        token = astTokens[i + 3];
        childNodes = ASTParser.getChildNodes(imports, token, props, parentNode, childNodes);
      }
    }

    return Object.values(childNodes);
  },

  // Extracts prop names from a JSX element
  getJSXProps(astTokens: Array<Token>, j: number): Record<string, boolean> {
    const props: Record<string, boolean> = {};
    while (astTokens[j].type.label !== 'jsxTagEnd') {
      if (astTokens[j].type.label === 'jsxName' && astTokens[j + 1].value === '=') {
        props[astTokens[j].value] = true;
      }
      j += 1;
    }
    return props;
  },

  // Checks if current Node is connected to React-Redux Store
  checkForRedux(astTokens: Array<Token>, imports: Record<string, ImportData>): boolean {
    // Check that react-redux is imported in this file (and we have a connect method or otherwise)
    let reduxImported = false;
    let connectAlias;
    Object.keys(imports).forEach((key) => {
      if (imports[key].importPath === 'react-redux' && imports[key].importName === 'connect') {
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
  },
};

const ImportParser = {
  /* Extracts Imports from current file
   * https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md
   * https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts
   */
  parse(body: Array<ASTNode>): Record<string, ImportData> {
    return body
      .filter((astNode) => isImportDeclaration(astNode) || isVariableDeclaration(astNode))
      .reduce((accum: Record<string, ImportData>, declaration) => {
        return isImportDeclaration(declaration)
          ? Object.assign(accum, ImportParser.parseImportDeclaration(declaration))
          : isVariableDeclaration(declaration)
          ? Object.assign(accum, ImportParser.parseVariableDeclaration(declaration))
          : accum;
      }, {});
  },

  /* Import Declarations: 
   * e.g. import foo from "mod"
   '.source': name/path of imported module
   https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#Imports
   */
  parseImportDeclaration(declaration: ImportDeclaration): Record<string, ImportData> {
    const output: Record<string, ImportData> = {};
    let importName = '';
    let importAlias: string | undefined;

    const importPath = declaration.source.value;
    declaration.specifiers.forEach((specifier) => {
      /*
       * e.g. {foo} in import {foo} from "mod"
       * e.g. {foo as bar} in import {foo as bar} from "mod"
       '.imported': name of export (foo), '.local': local binding/alias (bar)
       */
      if (isImportSpecifier(specifier)) {
        if (isIdentifier(specifier.imported)) {
          if (specifier.imported.name === specifier.local.name) {
            importName = specifier.imported.name;
          } else {
            importName = specifier.imported.name;
            importAlias = specifier.local.name;
          }
          /* TODO: Add tests
           * Import entire module for side effects only (no values imported)
           * e.g. import '/modules/my-module.js';
           * e.g. import 'http:example.com\pears.js';
           */
        } else if (isStringLiteral(specifier.imported)) {
          importName = path.basename(specifier.imported.value);
        }
        /* TODO: Add individual imported components to tree, not just namespace or default specifier
         * default -  e.g. 'foo' in import foo from "mod.js"
         * namespace - e.g. '* as foo' in import * as foo from "mod.js"
         */
      } else if (isImportDefaultSpecifier(specifier) || isImportNamespaceSpecifier(specifier)) {
        importName = specifier.local.name;
      }

      // If alias is used, it will show up as identifier for node instances in body.
      // Therefore, alias will take precedence over name for parsed ast token values.
      output[importAlias || importName] = {
        importPath,
        importName,
        importAlias,
      };
    });
    return output;
  },

  /* Imports Inside Variable Declarations (and current support status): 
   * [x] e.g. const foo = require("module");
   * [v] e.g. const [foo, bar] = require("module");
   * [v] e.g. const { foo: alias, bar } = require("module");
   * [x] e.g. const promise = import("module");
   * [x] e.g. const [foo, bar] = await import("module");
   * [x] e.g. const { foo: bar } = Promise.resolve(import("module"));
   * [v] e.g. const foo = React.lazy(() => import('./module'));
   https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#VariableDeclaration
   */
  parseVariableDeclaration(declaration: VariableDeclaration): Record<string, ImportData> {
    const output: Record<string, ImportData> = {};
    let importName = '';
    let importAlias: string | undefined;
    /* 
    * VariableDeclarator:
    Left: Pattern <: Identifier or (ObjectPattern | ArrayPattern) -> destructuring 
    Right: CallExpression - When the callee property is of type 'Import', arguments must have only one 'Expression' type element
    https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#VariableDeclarator
    https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#Patterns
    https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#CallExpression
    */
    declaration.declarations.forEach((declarator) => {
      const { id: LHS, init: RHS } = declarator;
      let importPath = '';

      // TODO: Support AwaitExpression, Promise.resolve(), then() chains for dynamic imports
      if (
        isCallExpression(RHS) &&
        (isImport(RHS.callee) || (isIdentifier(RHS.callee) && RHS.callee.name === 'require'))
      ) {
        // get importPath
        const importArg = RHS.arguments[0];
        importPath = isStringLiteral(importArg)
          ? importArg.value
          : isIdentifier(importArg) // almost certainly going to be StringLiteral, but guarding against edge cases
          ? importArg.name
          : '';
        if (!importPath.length) return;

        // e.g. const foo = import('module')
        // e.g. const foo = require('module')
        if (isIdentifier(LHS)) {
          importName = LHS.name;
          // e.g. const [foo, bar] = require('module');
        } else if (isArrayPattern(LHS)) {
          LHS.elements.forEach((element) => {
            if (element && isIdentifier(element)) {
              importName = element.name;
            }
            output[importName] = {
              importPath,
              importName,
            };
          });

          // e.g. const { foo } = require('module');
          // e.g. Aliasing: const { foo: bar } = require('module');
        } else if (isObjectPattern(LHS)) {
          LHS.properties.forEach((objectProperty) => {
            // assume rest parameters won't be used
            if (isObjectProperty(objectProperty)) {
              const { key: name, value: alias } = objectProperty;
              importName = isIdentifier(name) ? name.name : isStringLiteral(name) ? name.value : '';
              importAlias = isIdentifier(alias)
                ? alias.name
                : isStringLiteral(alias)
                ? alias.value
                : '';
              if (!importAlias.length || importName === importAlias) {
                importAlias = undefined;
              }
              output[importAlias || importName] = {
                importPath,
                importName,
                importAlias,
              };
            }
          });
        }
      }
      /* React lazy loading import
       * e.g. const foo = React.lazy(() => import('./module'));
       */
      importPath = ImportParser.parseNestedDynamicImports(declarator);
      if (importPath.length && isIdentifier(declarator.id)) {
        importName = declarator.id.name;
        output[importAlias || importName] = {
          importPath,
          importName,
          importAlias,
        };
      }
    });
    return output;
  },

  // TODO: Explicit parsing of nested Import CallExpression in ArrowFunctionExpression body
  // TODO: Support AwaitExpression, Promise.resolve(), then() chains for dynamic imports
  parseNestedDynamicImports(ast: ASTNode): string {
    const recurse = (node: ASTNode): string | void => {
      if (isCallExpression(node) && isImport(node.callee) && isStringLiteral(node.arguments[0])) {
        return node.arguments[0].value;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const key in node) {
        // @ts-expect-error
        if (node[key] && typeof node[key] === 'object') {
          // @ts-expect-error
          const importPath = recurse(node[key]);
          if (importPath) return importPath;
        }
      }
    };
    return recurse(ast) || '';
  },
};

// TODO: Follow import source paths and parse Export{Named,Default,All}Declarations
// See: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#exports
// Necessary for handling...
// barrel files, namespace imports, default import + namespace/named imports, require invocations/method calls, ...
const ExportParser = {};
