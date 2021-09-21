import * as babelParser from '@babel/parser';
import * as path from 'path';
import * as fs from 'fs';


// React component tree is a nested data structure, children are Trees
type Tree = {
  name: string,
  fileName: string,
  filePath: string,
  importPath: string,
  depth: number,
  count: number,
  thirdParty: boolean,
  reactRouter: boolean,
  children: Tree[],
  props: {[key: string]: boolean},
  error: string;
};


class SaplingParser {
  entryFile: string;
  tree: Tree | undefined;
  fileList: {[key: string] : boolean};

  constructor(filePath: string) {
    // Normalize filePath to posix
    this.entryFile = path.resolve(filePath.split(path.win32.sep).join(path.posix.sep));
    if (this.entryFile.includes('/wsl$/')) {
      console.log(this.entryFile.split('/'));
      this.entryFile = '/' + this.entryFile.split('/').slice(3).join('/');
    }
    console.log('ENTRY FILE PATH: ', this.entryFile);
    this.tree = undefined; //this.parser(this.entryFile);
    // Break down and reasemble given filePath safely for any OS using path?
  }


  // Public method to generate component tree based on current entryFile
  public parse() : Tree {
    // Create root Tree node
    const root = {
      name: path.basename(this.entryFile).replace(/\.(t|j)sx?$/, ''),
      fileName: path.basename(this.entryFile),
      filePath : this.entryFile,
      importPath: this.entryFile,
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


  // Recursively builds the React component tree structure starting from root node
  private parser(componentTree: Tree) : Tree {
    // If import is a node module, do not parse any deeper
    if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
      componentTree.thirdParty = true;
      if (componentTree.fileName === 'react-router-dom') {
        componentTree.reactRouter = true;
      }
      return;
    }

    // Check that file has valid fileName/Path, if not found, add error to node and halt
    const fileName = this.getFileName(componentTree);
    if (!fileName) {
      componentTree.error = 'File not found.';
      console.log('FILE NOT FOUND', componentTree);
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
      console.log('Error when trying to parse file', componentTree.filePath, fs.readdirSync('/Ubuntu'));
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
  private getImports(body : {[key : string]: any}[])
    : {[key : string]: {importPath: string, importName: string}} {
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
  private getJSXChildren(astTokens: [{[key: string]: any}],
    importsObj : {[key : string]: {importPath: string, importName: string}},
    parentNode: Tree) : Tree[] {

    const childNodes: {[key : string]: Tree} = {};

    for (let i = 0; i < astTokens.length; i++) {
      const token = astTokens[i + 1];

      if (astTokens[i].type.label === 'jsxTagStart'
      && token.type.label === 'jsxName'
      && importsObj[token.value]) {
        const props = this.getJSXProps(astTokens, i + 2);

        if (childNodes[token.value]) {
          childNodes[token.value].count += 1;
          childNodes[token.value].props = {...childNodes[token.value].props, ...props};
        } else {
          // Add tree node to childNodes if one does not exist
          childNodes[token.value] = {
            name: importsObj[token.value]['importName'],
            fileName: path.basename(importsObj[token.value]['importPath']),
            filePath: path.resolve(path.dirname(parentNode.filePath), importsObj[token.value]['importPath']),
            importPath: importsObj[token.value]['importPath'],
            depth: parentNode.depth + 1,
            thirdParty: false,
            reactRouter: false,
            count: 1,
            props: props,
            children: [],
            error: '',
          };
        }
      }
     }
    return Object.values(childNodes);
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

export default SaplingParser;