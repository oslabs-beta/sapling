"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.saplingParse = void 0;
var parser = require('@babel/parser');
var path = require('path');
var fs = require('fs');
function saplingParse(filePath, componentTree) {
    if (componentTree === void 0) { componentTree = {}; }
    // Edge case - no children or not related to React Components?
    // console.log('RUNNING SAPLING PARSER!!!', filePath);
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
            props: {},
            error: ''
        };
    }
    // Parse current file using Babel parser
    // EDGE CASE - WHAT IF filePath does not exist?
    // Check for import type - is it a node module or not?
    if (!['\\', '/', '.'].includes(componentTree.importPath[0])) {
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
    fs.writeFileSync(componentTree.filename + "-parser-output.json", JSON.stringify(ast));
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
    // console.log(ast.program.body);
    var imports = getImports(ast.program.body);
    // console.log('IMPORTS ARE: ', imports);
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
                    var props = getProps(astTokens, i + 2);
                    if (childNodes[token.value]) {
                        childNodes[token.value].count += 1;
                        childNodes[token.value].props = __assign(__assign({}, childNodes[token.value].props), props);
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
                            props: props,
                            children: [],
                            error: ''
                        };
                    }
                }
            }
        }
        return Object.values(childNodes);
    }
    // Helper functions to get props of React component
    function getProps(tokens, j) {
        // jsx invocations either end in /> or >
        // identify /> by label='/' and > by 'jsxTagEnd'
        var props = {};
        while (tokens[j].type.label !== "jsxTagEnd") {
            if (tokens[j].type.label === "jsxName" && tokens[j + 1].value === "=") {
                props[tokens[j].value] = true;
            }
            j += 1;
        }
        return props;
    }
    componentTree.children = getChildren(ast.tokens, imports, componentTree);
    function parseChildren(childNodeArray) {
        childNodeArray.forEach(function (child) { return saplingParse(child.filePath, child); });
    }
    parseChildren(componentTree.children);
    return componentTree;
}
exports.saplingParse = saplingParse;
;
var saplingoutput = saplingParse('./__tests__/test_9/index.js');
// console.log(saplingoutput);
fs.writeFileSync('sapling-output.json', JSON.stringify(saplingoutput));
// global attributes: ['accessKey', 'className', 'contentEditable', 'data-*', 'dir', 'draggable', 'hidden', 'id', 'lang', 'key', 'spellCheck', 'style', 'tabIndex', 'title', 'translate']
