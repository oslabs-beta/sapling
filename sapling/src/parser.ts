import * as babelParser from '@babel/parser';
import * as path from 'path';
import * as fs from 'fs';
import { getNonce } from "./getNonce";


// React component tree is a nested data structure, children are Trees
export type Tree = {
  id: string,
  name: string,
  fileName: string,
  filePath: string,
  importPath: string,
  expanded: boolean,
  depth: number,
  count: number,
  thirdParty: boolean,
  reactRouter: boolean,
  children: Tree[],
  props: {[key: string]: boolean},
  error: string;
};

type ImportObj = {
  [key : string]: {importPath: string, importName: string}
};


export class SaplingParser {
  entryFile: string;
  tree: Tree | undefined;
  fileList: {[key: string] : boolean};

  constructor(filePath: string) {
    // Normalize filePath to posix
    this.entryFile = path.resolve(filePath.split(path.win32.sep).join(path.posix.sep));
    if (this.entryFile.includes('/wsl$/')) {
      // console.log(this.entryFile.split('/'));
      this.entryFile = '/' + this.entryFile.split('/').slice(3).join('/');
    }
    // console.log('ENTRY FILE PATH: ', this.entryFile);
    this.tree = undefined;
    // Break down and reasemble given filePath safely for any OS using path?
  }

  // Public method to generate component tree based on current entryFile
  public parse() : Tree {
    // Create root Tree node
    const root = {
      id: getNonce(),
      name: path.basename(this.entryFile).replace(/\.(t|j)sx?$/, ''),
      fileName: path.basename(this.entryFile),
      filePath : this.entryFile,
      importPath: this.entryFile,
      expanded: false,
      depth: 0,
      count: 1,
      thirdParty: false,
      reactRouter: false,
      children: [],
      props: {},
      error: ''
    };

    this.tree = root;
    this.parser(root);
    return this.tree;
  }

  public getTree() : Tree {
    return this.tree;
  }

  // Set Sapling Parser with a specific Data Tree (from workspace state)
  public setTree(tree : Tree) : void {
    this.entryFile = tree.filePath;
    this.tree = tree;
  }

  // // Updates tree when a file is saved, checking for new components added from the updated tree
  // public updateTree(filePath : string) : Tree {

  //   const callback = (node) => {
  //     if (node.filePath === filePath) {
  //       this.parser(node);
  //     }
  //   };

  //   this.traverseTree(callback, this.tree);

  //   return this.tree;
  // }

  public updateTree(filePath : string) : Tree {
      let children = [];

      const getChildNodes = (node) => {
        const { depth, filePath, expanded } = node;
        children.push({ depth, filePath, expanded });
      };

      const matchExpand = (node) => {
        for (let i = 0 ; i < children.length ; i += 1) {
          const oldNode = children[i];
            if (oldNode.depth === node.depth && oldNode.filePath === node.filePath && oldNode.expanded) {
              node.expanded = true;
            }
        }
      };

      const callback = (node) => {
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
  public toggleNode(id : string, expanded : boolean) : Tree {
    const callback = (node) => {
      if (node.id === id) {
        console.log('These are the ids we\'re changing: ', node.id, id);
        node.expanded = expanded;
      }
    };

    this.#traverseTree(callback, this.tree);

    return this.tree;
  }

  // Traverses all nodes of current component tree and applies callback to each node
  #traverseTree(callback : Function, node : Tree = this.tree) : void {
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
    // console.log('Parsing node: ', componentTree.fileName);

    // If import is a node module, do not parse any deeper
    if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
      componentTree.thirdParty = true;
      if (componentTree.fileName === 'react-router-dom' || componentTree.fileName === 'react-router') {
        componentTree.reactRouter = true;
      }
      return;
    }

    // Check that file has valid fileName/Path, if not found, add error to node and halt
    const fileName = this.getFileName(componentTree);
    if (!fileName) {
      componentTree.error = 'File not found.';
      // console.log('FILE NOT FOUND', componentTree);
      return;
    }

    // Create abstract syntax tree of current component tree file
    let ast;
    try {
      ast = babelParser.parse(fs.readFileSync(path.resolve(componentTree.filePath), 'utf-8'), {
        sourceType: 'module',
        tokens: true,
        plugins: [
          'jsx'
        ]
      });
    } catch (err) {
      // console.log('Error when trying to parse file', componentTree.filePath, fs.readdirSync('/Ubuntu'));
      componentTree.error = 'Error while processing this file/node';
      return componentTree;
    }

    // Find imports in the current file, then find child components in the current file
    const imports = this.getImports(ast.program.body);

    // If current file imports React, get JSX Children:
    if (imports.React) {
      componentTree.children = this.getJSXChildren(ast.tokens, imports, componentTree);
    }

    // Recursively parse all child components
    componentTree.children.forEach(child => this.parser(child));

    return componentTree;
  }

  // Finds files where import string does not include a file extension
  private getFileName(componentTree: Tree) : string | undefined {
    const ext = path.extname(componentTree.filePath);
    let fileName = componentTree.fileName;

    if (!ext) {
      // Try and find file extension that exists in directory:
      const fileArray = fs.readdirSync(path.dirname(componentTree.filePath));
      const regEx = new RegExp(`${componentTree.fileName}.(j|t)sx?$`);
      fileName = fileArray.find(fileStr => fileStr.match(regEx));
      fileName ? componentTree.filePath += path.extname(fileName) : null;
    }

    return fileName;
  }

  // Extracts Imports from current file
  private getImports(body : {[key : string]: any}[]) : ImportObj {
    const bodyImports = body.filter(item => item.type === 'ImportDeclaration');
    return bodyImports.reduce((accum, curr) => {
      curr.specifiers.forEach( i => {
        accum[i.local.name] = {
          importPath: curr.source.value,
          importName: (i.imported)? i.imported.name : i.local.name
        };
      });

      // accum[curr.specifiers[0].local.name] = curr.source.value;
      return accum;
    }, {});
  }

  // Finds JSX React Components in current file
  private getJSXChildren(astTokens: [{[key: string]: any}], importsObj : ImportObj, parentNode: Tree) : Tree[] {
    let childNodes: {[key : string]: Tree} = {};
    let props : {[key : string]: boolean} = {};
    let token : {[key: string]: any};
    let loc : number;

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
        count: 1,
        props: props,
        children: [],
        error: '',
      };
    }

    return children;
  }

  // Extracts prop names from a JSX element
  private getJSXProps(astTokens: {[key: string]: any}[], j : number) : {[key : string]: boolean} {
    const props = {};
    while (astTokens[j].type.label !== "jsxTagEnd") {
      if (astTokens[j].type.label === "jsxName" && astTokens[j + 1].value === "=") {
        props[astTokens[j].value] = true;
      }
      j += 1;
    }
    return props;
  }
}
