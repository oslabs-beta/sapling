import * as path from 'path';
import * as assert from 'assert';

import { describe, suite, test, before } from 'mocha';
import { expect } from 'chai';

import { SaplingParser } from '../../SaplingParser';
import { Tree } from '../../types';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Parser Test Suite', () => {
  let tree: Tree, file: string;

  // UNPARSED TREE TEST
  describe('It initializes correctly', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
      tree = SaplingParser.parse(file);
    });

    test('A new instance of the parser class is an object', () => {
      expect(tree).to.be.an('object');
    });

    test('It initializes with a proper entry file', () => {
      expect(tree.filePath).to.equal(file);
    });
  });

  // TEST 0: ONE CHILD
  describe('It works for simple apps', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Parsing returns a object tree that is not undefined', () => {
      expect(tree).to.be.an('object');
    });

    test('Parsed tree has a property called name with value index and one child with name App', () => {
      expect(tree.name).that.is.equal('index');
      expect(tree.children).that.is.an('array');
      expect(tree.get(0).name).that.is.equal('App');
    });
  });

  // TEST 1: NESTED CHILDREN
  describe('It works for 2 components', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_1/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Parsed tree has a property called name with value index and one child with name App, which has its own child Main', () => {
      expect(tree.name).to.equal('index');
      expect(tree.get(0).name).to.equal('App');
      expect(tree.get(0).children).that.is.an('array');
      expect(tree.get(0, 0).name).to.equal('Main');
    });

    test('Parsed tree children should equal the child components', () => {
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.get(0).children).to.have.lengthOf(1);
    });

    test('Parsed tree depth is accurate', () => {
      expect(tree.depth).that.is.equal(0);
      expect(tree.get(0).depth).that.is.equal(1);
      expect(tree.get(0, 0).depth).that.is.equal(2);
    });
  });

  // TEST 2: THIRD PARTY, REACT ROUTER, DESTRUCTURED IMPORTS
  describe('It works for third party / React Router components and destructured imports', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_2/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Should parse destructured and third party imports', () => {
      expect(tree.children).to.have.lengthOf(3);
      expect(tree.get(0).name).that.is.oneOf(['Switch', 'Route']);
      expect(tree.get(1).name).that.is.oneOf(['Switch', 'Route']);
      expect(tree.get(2).name).that.is.equal('Tippy');
    });

    test('React router should be designated as third party and isReactRouter', () => {
      expect(tree.get(0).isThirdParty).to.be.true;
      expect(tree.get(1).isThirdParty).to.be.true;

      expect(tree.get(0).isReactRouter).to.be.true;
      expect(tree.get(1).isReactRouter).to.be.true;
    });

    test('Tippy should be designated as third party and not isReactRouter', () => {
      expect(tree.get(2).isThirdParty).to.be.true;
      expect(tree.get(2).isReactRouter).to.be.false;
    });
  });

  // TEST 3: IDENTIFIES REDUX STORE CONNECTION
  describe('It identifies a Redux store connection and designates the component as such', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_3/index.js');
      tree = SaplingParser.parse(file);
    });

    test('The hasReduxConnect properties of the connected component and the unconnected component should be true and false, respectively', () => {
      expect(tree.get(1, 0).name).to.equal('ConnectedContainer');
      expect(tree.get(1, 0).hasReduxConnect).that.is.true;

      expect(tree.get(1, 1).name).to.equal('UnconnectedContainer');
      expect(tree.get(1, 1).hasReduxConnect).that.is.false;
    });
  });

  // TEST 4: ALIASED IMPORTS
  describe('It works for aliases', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_4/index.js');
      tree = SaplingParser.parse(file);
    });

    test('alias should still give us components', () => {
      expect(tree.children).to.have.lengthOf(2);
      expect(tree.get(0).name).that.is.equal('Switch');
      expect(tree.get(1).name).that.is.equal('Route');

      expect(tree.get(0).name).that.is.not.equal('S');
      expect(tree.get(1).name).that.is.not.equal('R');
    });
  });

  // TEST 5: MISSING EXTENSIONS AND UNUSED IMPORTS
  describe('It works for extension-less imports', () => {
    let names: string[], paths: string[], expectedNames: string[], expectedPaths: string[];
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_5/index.js');
      tree = SaplingParser.parse(file);

      names = tree.children.map((child) => child.name);
      paths = tree.children.map((child) => child.filePath);

      expectedNames = ['JS', 'JSX', 'TS', 'TSX'];
      expectedPaths = [
        '../../../src/test/test_apps/test_5/components/JS.js',
        '../../../src/test/test_apps/test_5/components/JSX.jsx',
        '../../../src/test/test_apps/test_5/components/TS.ts',
        '../../../src/test/test_apps/test_5/components/TSX.tsx',
      ].map((el) => path.resolve(__dirname, el));
    });

    test('Check children match expected children', () => {
      expect(tree.children).to.have.lengthOf(4);

      for (let i = 0; i < tree.children.length; i++) {
        expect(tree.children[i].name).to.equal(expectedNames[i]);
        expect(tree.children[i].filePath).to.equal(expectedPaths[i]);
        expect(tree.children[i].error).to.equal('');
      }
    });

    test('Imports that are not invoked should not be children', () => {
      expect(names).to.not.contain('Switch');
      expect(names).to.not.contain('Route');
    });
  });

  // TEST 6: BAD IMPORT OF APP2 FROM APP1 COMPONENT
  describe('It works for badly imported children nodes', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_6/index.js');
      tree = SaplingParser.parse(file);
    });

    test('improperly imported child component should exist but show an error', () => {
      expect(tree.get(0, 0).name).that.equals('App2');
      expect(tree.get(0, 0).error).that.does.not.equal('');
    });
  });

  // TEST 7: SYNTAX ERROR IN APP FILE CAUSES PARSER ERROR
  describe('It should log an error when the parser encounters a javascript syntax error', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_7/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Should have a nonempty error message on the invalid child and not parse further', () => {
      expect(tree.get(0).name).that.equals('App');
      expect(tree.get(0).error).that.does.not.equal('');
      expect(tree.get(0).children).to.have.lengthOf(0);
    });
  });

  // TEST 8: MULTIPLE PROPS ON ONE COMPONENT
  describe('It should properly count repeat components and consolidate and grab their props', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_8/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Grandchild should have a count of 1', () => {
      expect(tree.get(0, 0).count).that.equals(1);
    });

    test('Grandchild should have the correct three props', () => {
      expect(tree.get(0, 0).props).has.own.property('prop1').that.is.true;
      expect(tree.get(0, 0).props).has.own.property('prop2').that.is.true;
      expect(tree.get(0, 0).props).has.own.property('prop3').that.is.true;
    });
  });

  // TEST 9: FINDING DIFFERENT PROPS ACROSS TWO OR MORE IDENTICAL COMPONENTS
  describe('It should properly count repeat components and consolidate and grab their props', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_9/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Grandchild should have a count of 2', () => {
      expect(tree.get(0, 0).count).that.equals(2);
    });

    test('Grandchild should have the correct two props', () => {
      expect(tree.get(0, 0).props).has.own.property('prop1').that.is.true;
      expect(tree.get(0, 0).props).has.own.property('prop2').that.is.true;
    });
  });

  // TEST 10: CHECK CHILDREN WORKS AND COMPONENTS WORK
  describe('It should render children when children are rendered as values of prop called component', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_10/index.jsx');
      tree = SaplingParser.parse(file);
    });

    test('Parent should have children that match the value stored in component prop', () => {
      expect(tree.get(0).name).that.is.equal('BrowserRouter');
      expect(tree.get(1).name).that.is.equal('App');

      expect(tree.get(1, 3).name).that.is.equal('DrillCreator');
      expect(tree.get(1, 4).name).that.is.equal('HistoryDisplay');
    });
  });

  // TEST 11: PARSER DOESN'T BREAK UPON RECURSIVE COMPONENTS
  describe('It should render the second call of mutually recursive components, but no further', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_11/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Tree should not be undefined', () => {
      expect(tree).to.not.be.undefined;
    });

    test('Tree should have an index component while child App1, grandchild App2, great-grandchild App1', () => {
      expect(tree.name).that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.get(0).name).that.is.equal('App1');
      expect(tree.get(0).children).to.have.lengthOf(1);
      expect(tree.get(0, 0).name).that.is.equal('App2');
      expect(tree.get(0, 0).children).to.have.lengthOf(1);
      expect(tree.get(0, 0, 0).name).that.is.equal('App1');
      expect(tree.get(0, 0, 0).children).to.have.lengthOf(0);
    });
  });

  // TEST 12: NEXT.JS APPS
  describe('It should parse Next.js applications', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_12/pages/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Root should be named index, children should be named Head, Navbar, and Image, children of Navbar should be named Link and Image', () => {
      expect(tree.name).that.is.equal('index');
      expect(tree.children).to.have.lengthOf(3);
      expect(tree.get(0).name).that.is.equal('Head');
      expect(tree.get(1).name).that.is.equal('Navbar');
      expect(tree.get(2).name).that.is.equal('Image');

      expect(tree.get(1).children).to.have.lengthOf(2);
      expect(tree.get(1, 0).name).that.is.equal('Link');
      expect(tree.get(1, 1).name).that.is.equal('Image');
    });
  });

  // TEST 13: Variable Declaration Imports and React.lazy Imports
  describe('It should parse VariableDeclaration imports including React.lazy imports', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_13/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Root should be named index, it should have one child named App', () => {
      expect(tree.name).that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.get(0).name).that.is.equal('App');
    });

    test('App should have three children, Page1, Page2 and Page3, all found successfully', () => {
      expect(tree.get(0, 0).name).that.is.equal('Page1');
      expect(tree.get(0, 0).isThirdParty).that.is.false;
      expect(tree.get(0, 1).name).that.is.equal('Page2');
      expect(tree.get(0, 1).isThirdParty).that.is.false;
    });
  });

  // TEST 14: REQUIRE STATEMENTS WITH DESTRUCTURING, ALIASING
  describe('It should parse require function calls with destructuring and aliasing', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_14/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Root should be named index, it should have one child named App', () => {
      expect(tree.name).that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.get(0).name).that.is.equal('App');
    });

    test('Object destructured children PageA1, PageA2 successfully found. PageA1 is found with its filename, not as Alias.', () => {
      expect(tree.get(0, 0).name).that.is.not.equal('Alias');
      expect(tree.get(0, 0).name).that.is.equal('PageA1');
      expect(tree.get(0, 0).isThirdParty).that.is.false;
      expect(tree.get(0, 1).name).that.is.equal('PageA2');
      expect(tree.get(0, 1).isThirdParty).that.is.false;
    });
    test('Array destructured require import PageB1, PageB2 all found successfully', () => {
      expect(tree.get(0, 2).name).that.is.equal('PageB1');
      expect(tree.get(0, 2).isThirdParty).that.is.false;
      expect(tree.get(0, 3).name).that.is.equal('PageB2');
      expect(tree.get(0, 3).isThirdParty).that.is.false;
    });
  });

  // TEST 15: VARIABLE DECLARATION IMPORTS WITH DESTRUCTURING, ALIASING
  describe('It should parse variable declaration imports with Array Destructuring, and Object Destructuring with Aliasing', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_15/index.js');
      tree = SaplingParser.parse(file);
    });

    test('Root should be named index, it should have one child named App', () => {
      expect(tree.name).that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.get(0).name).that.is.equal('App');
    });

    test('Object destructured children PageA1, PageA2 successfully found. PageA1 is found with its filename, not as Alias.', () => {
      expect(tree.get(0, 0).name).that.is.not.equal('Alias');
      expect(tree.get(0, 0).name).that.is.equal('PageA1');
      expect(tree.get(0, 0).isThirdParty).that.is.false;
      expect(tree.get(0, 1).name).that.is.equal('PageA2');
      expect(tree.get(0, 1).isThirdParty).that.is.false;
    });
    test('Array destructured children PageB1, PageB2 all found successfully', () => {
      expect(tree.get(0, 2).name).that.is.equal('PageB1');
      expect(tree.get(0, 2).isThirdParty).that.is.false;
      expect(tree.get(0, 3).name).that.is.equal('PageB2');
      expect(tree.get(0, 3).isThirdParty).that.is.false;
    });
  });
});
