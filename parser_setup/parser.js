var parser = require('@babel/parser');
var path = require('path');
var fs = require('fs');
function saplingParse(filePath, componentTree) {
    // Edge case - no children or not related to React Components?
    if (componentTree === void 0) { componentTree = {}; }
    // If starting on entry point create component Tree root
    if (!Object.keys(componentTree).length) {
        componentTree = {
            name: path.basename(filePath).replace(/\.(t|j)sx?$/, ''),
            filename: path.basename(filePath),
            filePath: filePath,
            importPath: filePath,
            depth: 0,
            count: 1,
            thirdParty: false,
            reactRouter: false,
            children: [],
            error: ''
        };
    }
    // Parse current file using Babel parser
    // EDGE CASE - WHAT IF filePath does not exist?
    // Check for import type - is it a node module or not?
    if (!['/', '.'].includes(componentTree.importPath[0])) {
        componentTree.thirdParty = true;
        if (componentTree.filename === 'react-router-dom')
            componentTree.reactRouter = true;
        return;
    }
    // Need additional logic here to check for different extension types
    // if no extension is present -> .js .jsx .ts .tsx
    var ext = path.extname(filePath);
    if (!ext) {
        // Try and find file extension that exists in directory:
        var fileArray = fs.readdirSync(path.dirname(componentTree.filePath));
        var regEx_1 = new RegExp(componentTree.filename + ".(j|t)sx?$");
        var fileName = fileArray.find(function (fileStr) { return fileStr.match(regEx_1); });
        componentTree.filePath += path.extname(fileName);
        filePath = componentTree.filePath;
    }
    var ast;
    try {
        ast = parser.parse(fs.readFileSync(filePath, 'utf-8'), {
            sourceType: 'module',
            tokens: true,
            plugins: [
                'jsx'
            ]
        });
    }
    catch (err) {
        componentTree.error = 'Error while processing this file/node';
        return componentTree;
    }
    fs.writeFileSync('parser-output-destructure-and-alias.json', JSON.stringify(ast));
    // Determine if React is imported in file and JSX Children may be present
    function getImports(body) {
        var bodyImports = body.filter(function (item) { return item.type === 'ImportDeclaration'; });
        // EDGE CASE: Object Destructuring Import need to account for this
        return bodyImports.reduce(function (accum, curr) {
            // if object destructuring, need to grab each one
            // e.g. import {Switch as S, Route as R} from ...
            curr.specifiers.forEach(function (i) {
                accum[i.local.name] = {
                    importPath: curr.source.value,
                    importName: (i.imported) ? i.imported.name : i.local.name
                };
            });
            // accum[curr.specifiers[0].local.name] = curr.source.value;
            return accum;
        }, {});
    }
    console.log(ast.program.body);
    var imports = getImports(ast.program.body);
    console.log('IMPORTS ARE: ', imports);
    // Find child components via JSX Elements if React is imported
    function getChildren(astTokens, importsObj, parentNode) {
        // Check if React is imported inside file => JSX Children
        var childNodes = {};
        if (importsObj.React) {
            // Look for JSX elements
            for (var i = 0; i < astTokens.length - 1; i++) {
                // If we have opening JSX tag
                var token = astTokens[i + 1];
                // Check if current JSX component has been imported
                if (astTokens[i].type.label === "jsxTagStart" && token.type.label === 'jsxName' && importsObj[token.value]) {
                    if (childNodes[token.value]) {
                        childNodes[token.value].count += 1;
                    }
                    else {
                        // Add tree node to childNodes if one does not exist
                        childNodes[token.value] = {
                            name: importsObj[token.value]['importName'],
                            filename: path.basename(importsObj[token.value]['importPath']),
                            filePath: path.resolve(path.dirname(parentNode.filePath), importsObj[token.value]['importPath']),
                            importPath: importsObj[token.value]['importPath'],
                            depth: parentNode.depth + 1,
                            thirdParty: false,
                            reactRouter: false,
                            count: 1,
                            children: [],
                            error: ''
                        };
                    }
                }
            }
        }
        return Object.values(childNodes);
    }
    componentTree.children = getChildren(ast.tokens, imports, componentTree);
    function parseChildren(childNodeArray) {
        childNodeArray.forEach(function (child) { return saplingParse(child.filePath, child); });
    }
    parseChildren(componentTree.children);
    return componentTree;
}
;
var saplingoutput = saplingParse('./__tests__/test_6/index.js');
console.log(saplingoutput);
fs.writeFileSync('sapling-output.json', JSON.stringify(saplingoutput));
module.exports = saplingParse;
