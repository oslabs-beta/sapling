const parser = require('@babel/parser');
const path = require('path');
const fs = require('fs');

// npx tsc --watch parser.ts to watch for changes in this file

// //console.log(fs.readFileSync("__tests__/test_0/index.js", 'utf-8'));
// fs.writeFileSync('parser-output.json', JSON.stringify(parser.parse(fs.readFileSync("__tests__/test_0/index.js", 'utf-8'), {
//   sourceType: 'module',
//   plugins: [
//     'jsx'
//   ]
// })));

// parse initial file into raw ast
// extract jsx elements from ast --> format into object here?
// if there are imported files, run parser on those recursively
// build tree structure for react component hierarchy and return

// Each Node in hierarchy e.g.:
// {
//   name: Main,
//   filename: 'Main.jsx',
//   filepath: '/path/to/file/Main.jsx',
//   depth: 0,
//   children : [array, of, child, react, components],
// }
//

// const rootNode = {
//   name: path.basename(filename).replace(/\.jsx?/, ''),
//   filename,
//   depth: 0,
//   children: [],
// };

type Tree = {
  name: string,
  filename: string,
  filePath: string,
  importPath: string,
  depth: number,
  count: number,
  thirdParty: boolean,
  reactRouter: boolean,
  children: Tree[]
}


function saplingParse(filePath, componentTree = {} as Tree) {
  // Edge case - no children or not related to React Components?

  // If starting on entry point create component Tree root
  if (!Object.keys(componentTree).length) {
    componentTree = {
      name: path.basename(filePath).replace(/\.(t|j)sx?$/, ''),
      filename:  path.basename(filePath),
      filePath,
      importPath: filePath,
      depth: 0,
      count: 1,
      thirdParty: false,
      reactRouter: false,
      children: []
    }
  }

  // Parse current file using Babel parser
  // EDGE CASE - WHAT IF filePath does not exist?

  // Check for import type - is it a node module or not?
  if (!['/', '.'].includes(componentTree.importPath[0])) {
    componentTree.thirdParty = true;
    if (componentTree.filename === 'react-router-dom') componentTree.reactRouter = true;
    return;
  }

  // Need additional logic here to check for different extension types
  // if no extension is present -> .js .jsx .ts .tsx
  const ast = parser.parse(fs.readFileSync(filePath, 'utf-8'), {
    sourceType: 'module',
    tokens: true,
    plugins: [
      'jsx'
    ]
  });

  fs.writeFileSync('parser-output.json', JSON.stringify(ast));

  // Determine if React is imported in file and JSX Children may be present
  function getImports(body) {
    const bodyImports = body.filter(item => item.type === 'ImportDeclaration')
    // EDGE CASE: Object Destructuring Import need to account for this
    return bodyImports.reduce((accum, curr) => {
      accum[curr.specifiers[0].local.name] = curr.source.value;
      return accum;
    }, {});
  }

  console.log(ast.program.body);
  const imports = getImports(ast.program.body);
  console.log('IMPORTS ARE: ', imports);

  // Find child components via JSX Elements if React is imported
  function getChildren(astTokens, importsObj, parentNode) {
    // Check if React is imported inside file => JSX Children
    const childNodes: {[key:string]: Tree} = {};
    if (importsObj.React) {
      // Look for JSX elements
      for (let i = 0; i < astTokens.length-1; i++) {
        // If we have opening JSX tag
        const token = astTokens[i + 1];
        // Check if current JSX component has been imported
        if (astTokens[i].type.label === "jsxTagStart" && token.type.label === 'jsxName' && importsObj[token.value]) {
          if (childNodes[token.value]) {
            childNodes[token.value].count += 1;
          } else {
            // Add tree node to childNodes if one does not exist
            childNodes[token.value] = {
              name: token.value,
              filename: path.basename(importsObj[token.value]),
              filePath: path.resolve(path.dirname(parentNode.filePath),importsObj[token.value]),
              importPath: importsObj[token.value],
              depth: parentNode.depth + 1,
              thirdParty: false,
              reactRouter: false,
              count: 1,
              children: []
            }
          }
        }
      }
    }
    return Object.values(childNodes);
  }

  componentTree.children =  getChildren(ast.tokens, imports, componentTree);

  function parseChildren(childNodeArray) {
    childNodeArray.forEach(child => saplingParse(child.filePath, child));
  }

  parseChildren(componentTree.children)


  return componentTree;
};

console.log('SAPLING PARSER OUTPUT: ', saplingParse('./__tests__/test_2/index.js'));

module.exports = saplingParse;
