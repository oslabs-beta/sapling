import * as path from 'path';
import { describe, suite, test, before } from 'mocha';
import { expect } from 'chai';
import * as assert from 'assert';

import { SaplingParser } from '../../SaplingParser';
import { Tree } from '../../types';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Parser Test Suite', () => {
  let parser: SaplingParser, tree: Tree, file: string;

  // UNPARSED TREE TEST
  describe('It initializes correctly', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
      parser = new SaplingParser(file);
    });

    test('A new instance of the parser class is an object', () => {
      expect(parser).to.be.an('object');
    });

    test('It initializes with a proper entry file and an undefined tree', () => {
      expect(parser.entryFile).to.equal(file);
      expect(parser.tree).to.be.undefined;
    });
  });

  // TEST 0: ONE CHILD
  describe('It works for simple apps', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_0/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Parsing returns a object tree that is not undefined', () => {
      expect(tree).to.be.an('object');
    });

    test('Parsed tree has a property called name with value index and one child with name App', () => {
      expect(tree).to.have.own.property('name').that.is.equal('index');
      expect(tree).to.have.own.property('children').that.is.an('array');
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('App');
    });
  });

  // TEST 1: NESTED CHILDREN
  describe('It works for 2 components', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_1/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Parsed tree has a property called name with value index and one child with name App, which has its own child Main', () => {
      expect(tree).to.have.own.property('name').to.equal('index');
      expect(tree.children[0].name).to.equal('App');
      expect(tree.children[0]).to.have.own.property('children').that.is.an('array');
      expect(tree.children[0].children[0]).to.have.own.property('name').to.equal('Main');
    });

    test('Parsed tree children should equal the child components', () => {
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.children[0].children).to.have.lengthOf(1);
    });

    test('Parsed tree depth is accurate', () => {
      expect(tree).to.have.own.property('depth').that.is.equal(0);
      expect(tree.children[0]).to.have.own.property('depth').that.is.equal(1);
      expect(tree.children[0].children[0]).to.have.own.property('depth').that.is.equal(2);
    });
  });

  // TEST 2: THIRD PARTY, REACT ROUTER, DESTRUCTURED IMPORTS
  describe('It works for third party / React Router components and destructured imports', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_2/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Should parse destructured and third party imports', () => {
      expect(tree.children).to.have.lengthOf(3);
      expect(tree.children[0]).to.have.own.property('name').that.is.oneOf(['Switch', 'Route']);
      expect(tree.children[1]).to.have.own.property('name').that.is.oneOf(['Switch', 'Route']);
      expect(tree.children[2]).to.have.own.property('name').that.is.equal('Tippy');
    });

    test('reactRouter should be designated as third party and reactRouter', () => {
      expect(tree.children[0]).to.have.own.property('thirdParty').to.be.true;
      expect(tree.children[1]).to.have.own.property('thirdParty').to.be.true;

      expect(tree.children[0]).to.have.own.property('reactRouter').to.be.true;
      expect(tree.children[1]).to.have.own.property('reactRouter').to.be.true;
    });

    test('Tippy should be designated as third party and not reactRouter', () => {
      expect(tree.children[2]).to.have.own.property('thirdParty').to.be.true;
      expect(tree.children[2]).to.have.own.property('reactRouter').to.be.false;
    });
  });

  // TEST 3: IDENTIFIES REDUX STORE CONNECTION
  describe('It identifies a Redux store connection and designates the component as such', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_3/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('The reduxConnect properties of the connected component and the unconnected component should be true and false, respectively', () => {
      expect(tree.children[1].children[0].name).to.equal('ConnectedContainer');
      expect(tree.children[1].children[0]).to.have.own.property('reduxConnect').that.is.true;

      expect(tree.children[1].children[1].name).to.equal('UnconnectedContainer');
      expect(tree.children[1].children[1]).to.have.own.property('reduxConnect').that.is.false;
    });
  });

  // TEST 4: ALIASED IMPORTS
  describe('It works for aliases', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_4/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('alias should still give us components', () => {
      expect(tree.children).to.have.lengthOf(2);
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('Switch');
      expect(tree.children[1]).to.have.own.property('name').that.is.equal('Route');

      expect(tree.children[0]).to.have.own.property('name').that.is.not.equal('S');
      expect(tree.children[1]).to.have.own.property('name').that.is.not.equal('R');
    });
  });

  // TEST 5: MISSING EXTENSIONS AND UNUSED IMPORTS
  describe('It works for extension-less imports', () => {
    let names: string[], paths: string[], expectedNames: string[], expectedPaths: string[];
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_5/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();

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
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('improperly imported child component should exist but show an error', () => {
      expect(tree.children[0].children[0]).to.have.own.property('name').that.equals('App2');
      expect(tree.children[0].children[0]).to.have.own.property('error').that.does.not.equal('');
    });
  });

  // TEST 7: SYNTAX ERROR IN APP FILE CAUSES PARSER ERROR
  describe('It should log an error when the parser encounters a javascript syntax error', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_7/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Should have a nonempty error message on the invalid child and not parse further', () => {
      expect(tree.children[0]).to.have.own.property('name').that.equals('App');
      expect(tree.children[0]).to.have.own.property('error').that.does.not.equal('');
      expect(tree.children[0].children).to.have.lengthOf(0);
    });
  });

  // TEST 8: MULTIPLE PROPS ON ONE COMPONENT
  describe('It should properly count repeat components and consolidate and grab their props', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_8/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Grandchild should have a count of 1', () => {
      expect(tree.children[0].children[0]).to.have.own.property('count').that.equals(1);
    });

    test('Grandchild should have the correct three props', () => {
      expect(tree.children[0].children[0].props).has.own.property('prop1').that.is.true;
      expect(tree.children[0].children[0].props).has.own.property('prop2').that.is.true;
      expect(tree.children[0].children[0].props).has.own.property('prop3').that.is.true;
    });
  });

  // TEST 9: FINDING DIFFERENT PROPS ACROSS TWO OR MORE IDENTICAL COMPONENTS
  describe('It should properly count repeat components and consolidate and grab their props', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_9/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Grandchild should have a count of 2', () => {
      expect(tree.children[0].children[0]).to.have.own.property('count').that.equals(2);
    });

    test('Grandchild should have the correct two props', () => {
      expect(tree.children[0].children[0].props).has.own.property('prop1').that.is.true;
      expect(tree.children[0].children[0].props).has.own.property('prop2').that.is.true;
    });
  });

  // TEST 10: CHECK CHILDREN WORKS AND COMPONENTS WORK
  describe('It should render children when children are rendered as values of prop called component', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_10/index.jsx');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Parent should have children that match the value stored in component prop', () => {
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('BrowserRouter');
      expect(tree.children[1]).to.have.own.property('name').that.is.equal('App');

      expect(tree.children[1].children[3])
        .to.have.own.property('name')
        .that.is.equal('DrillCreator');
      expect(tree.children[1].children[4])
        .to.have.own.property('name')
        .that.is.equal('HistoryDisplay');
    });
  });

  // TEST 11: PARSER DOESN'T BREAK UPON RECURSIVE COMPONENTS
  describe('It should render the second call of mutually recursive components, but no further', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_11/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Tree should not be undefined', () => {
      expect(tree).to.not.be.undefined;
    });

    test('Tree should have an index component while child App1, grandchild App2, great-grandchild App1', () => {
      expect(tree).to.have.own.property('name').that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('App1');
      expect(tree.children[0].children).to.have.lengthOf(1);
      expect(tree.children[0].children[0]).to.have.own.property('name').that.is.equal('App2');
      expect(tree.children[0].children[0].children).to.have.lengthOf(1);
      expect(tree.children[0].children[0].children[0])
        .to.have.own.property('name')
        .that.is.equal('App1');
      expect(tree.children[0].children[0].children[0].children).to.have.lengthOf(0);
    });
  });

  // TEST 12: NEXT.JS APPS
  describe('It should parse Next.js applications', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_12/pages/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Root should be named index, children should be named Head, Navbar, and Image, children of Navbar should be named Link and Image', () => {
      expect(tree).to.have.own.property('name').that.is.equal('index');
      expect(tree.children).to.have.lengthOf(3);
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('Head');
      expect(tree.children[1]).to.have.own.property('name').that.is.equal('Navbar');
      expect(tree.children[2]).to.have.own.property('name').that.is.equal('Image');

      expect(tree.children[1].children).to.have.lengthOf(2);
      expect(tree.children[1].children[0]).to.have.own.property('name').that.is.equal('Link');
      expect(tree.children[1].children[1]).to.have.own.property('name').that.is.equal('Image');
    });
  });

  // TEST 13: Variable Declaration Imports and React.lazy Imports
  describe('It should parse VariableDeclaration imports including React.lazy imports', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_13/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Root should be named index, it should have one child named App', () => {
      expect(tree).to.have.own.property('name').that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('App');
    });

    test('App should have three children, Page1, Page2 and Page3, all found successfully', () => {
      expect(tree.children[0].children[0]).to.have.own.property('name').that.is.equal('Page1');
      expect(tree.children[0].children[0]).to.have.own.property('thirdParty').that.is.false;
      expect(tree.children[0].children[1]).to.have.own.property('name').that.is.equal('Page2');
      expect(tree.children[0].children[1]).to.have.own.property('thirdParty').that.is.false;
    });
  });

  // TEST 14: DYNAMIC IMPORTS WITH DESTRUCTURING, ALIASING
  describe('It should parse dynamic imports with promise resolving, Array Destructuring, and Object Destructuring with Aliasing', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_14/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Root should be named index, it should have one child named App', () => {
      expect(tree).to.have.own.property('name').that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('App');
    });

    test('Object destructuring child Page11 and aliased child Page1 found successfully with its filename, not as Alias', () => {
      expect(tree.children[0].children[0]).to.have.own.property('name').that.is.not.equal('Alias');
      expect(tree.children[0].children[0]).to.have.own.property('name').that.is.equal('Page1');
      expect(tree.children[0].children[0]).to.have.own.property('thirdParty').that.is.false;
      expect(tree.children[0].children[1]).to.have.own.property('name').that.is.equal('Page11');
      expect(tree.children[0].children[1]).to.have.own.property('thirdParty').that.is.false;
    });
    test('Array destructured variable declaration imports Page1of2, Page2f2 all found successfully', () => {
      expect(tree.children[0].children[2]).to.have.own.property('name').that.is.equal('Page1of2');
      expect(tree.children[0].children[2]).to.have.own.property('thirdParty').that.is.false;
      expect(tree.children[0].children[3]).to.have.own.property('name').that.is.equal('Page2of2');
      expect(tree.children[0].children[3]).to.have.own.property('thirdParty').that.is.false;
    });
    test('Variable assigned Page3 found successfully', () => {
      expect(tree.children[0].children[4]).to.have.own.property('name').that.is.equal('Page3');
      expect(tree.children[0].children[4]).to.have.own.property('thirdParty').that.is.false;
    });
    // test('Dynamic import nested in Promise.resolve,Page4_1, Page4_2 found successfully', () => {
    //   expect(tree.children[0].children[5]).to.have.own.property('name').that.is.equal('Page4_1');
    //   expect(tree.children[0].children[5]).to.have.own.property('thirdParty').that.is.false;
    //   expect(tree.children[0].children[6]).to.have.own.property('name').that.is.equal('Page4_2');
    //   expect(tree.children[0].children[6]).to.have.own.property('thirdParty').that.is.false;
    // });
    // test('Dynamic import nested in AwaitExpression Page5 found successfully', () => {
    //   expect(tree.children[0].children[7]).to.have.own.property('name').that.is.equal('Page5');
    //   expect(tree.children[0].children[7]).to.have.own.property('thirdParty').that.is.false;
    // });
  });

  // TEST 15: REQUIRE STATEMENTS WITH DESTRUCTURING, ALIASING
  describe('It should parse REQUIRE statements with destructuring and aliasing', () => {
    before(() => {
      file = path.join(__dirname, '../../../src/test/test_apps/test_15/index.js');
      parser = new SaplingParser(file);
      tree = parser.parse();
    });

    test('Root should be named index, it should have one child named App', () => {
      expect(tree).to.have.own.property('name').that.is.equal('index');
      expect(tree.children).to.have.lengthOf(1);
      expect(tree.children[0]).to.have.own.property('name').that.is.equal('App');
    });

    test('Object destructuring aliased child Page1 found successfully with its filename, not as Alias', () => {
      expect(tree.children[0].children[0]).to.have.own.property('name').that.is.not.equal('Alias');
      expect(tree.children[0].children[0]).to.have.own.property('name').that.is.equal('Page1');
      expect(tree.children[0].children[0]).to.have.own.property('thirdParty').that.is.false;
      expect(tree.children[0].children[1]).to.have.own.property('name').that.is.equal('Page11');
      expect(tree.children[0].children[1]).to.have.own.property('thirdParty').that.is.false;
    });
    test('Array destructured require import Page1of2, Page2f2 all found successfully', () => {
      expect(tree.children[0].children[2]).to.have.own.property('name').that.is.equal('Page1of2');
      expect(tree.children[0].children[2]).to.have.own.property('thirdParty').that.is.false;
      expect(tree.children[0].children[3]).to.have.own.property('name').that.is.equal('Page2of2');
      expect(tree.children[0].children[3]).to.have.own.property('thirdParty').that.is.false;
    });
    // test('Require statement import Page3 with local namespace page found successfully', () => {
    //   expect(tree.children[0].children[4]).to.have.own.property('name').that.is.equal('Page3');
    //   expect(tree.children[0].children[4]).to.have.own.property('thirdParty').that.is.false;
    // });
  });

  // // TEST 16: BARREL FILES / BATCH EXPORTS / FOLDERS AS MODULES
  // describe('It should parse folders that are imported as modules', () => {
  //   before(() => {
  //     file = path.join(__dirname, '../../../src/test/test_apps/test_16/index.js');
  //     parser = new SaplingParser(file);
  //     tree = parser.parse();
  //   });

  //   test('Root should be named index, it should have one child named App', () => {
  //     expect(tree).to.have.own.property('name').that.is.equal('index');
  //     expect(tree.children).to.have.lengthOf(1);
  //     expect(tree.children[0]).to.have.own.property('name').that.is.equal('App');
  //   });

  //   test('App should have three children, Page1, Page2 and Page3, all found successfully', () => {
  //     expect(tree.children[0].children[0]).to.have.own.property('name').that.is.equal('Page1');
  //     expect(tree.children[0].children[0]).to.have.own.property('thirdParty').that.is.false;
  //     expect(tree.children[0].children[1]).to.have.own.property('name').that.is.equal('Page2');
  //     expect(tree.children[0].children[1]).to.have.own.property('thirdParty').that.is.false;
  //     expect(tree.children[0].children[2]).to.have.own.property('name').that.is.equal('Page3');
  //   });

  // test('Page1 should have one child named Child1', () => {
  //   expect(tree).to.have.own.property('name').that.is.equal('index');
  //   expect(tree.children[0].children[0]).to.have.lengthOf(1);
  //   expect(tree.children[0].children[0].children[0])
  //     .to.have.own.property('name')
  //     .that.is.equal('Child1');
  // });
  // expect(tree.children[0].children[0].children[0]).to.have.own.property('thirdParty').that.is
  //   .false;
  // });

  // // TEST 17:
  // test('Glob export with namespace specifier', () => {
  //   expect(tree.children[0].children[3])
  //     .to.have.own.property('name')
  //     .that.is.equal('namespace.Page3_1');
  //   expect(tree.children[0].children[3]).to.have.own.property('thirdParty').that.is.false;
  //   expect(tree.children[0].children[4])
  //     .to.have.own.property('name')
  //     .that.is.equal('namespace.Page3_2');
  //   expect(tree.children[0].children[4]).to.have.own.property('thirdParty').that.is.false;
  //   expect(tree.children[0].children[5])
  //     .to.have.own.property('name')
  //     .that.is.equal('LastPage.Page4_1');
  //   expect(tree.children[0].children[5]).to.have.own.property('thirdParty').that.is.false;
  //   expect(tree.children[0].children[6])
  //     .to.have.own.property('name')
  //     .that.is.equal('LastPage.Page4_2');
  //   expect(tree.children[0].children[6]).to.have.own.property('thirdParty').that.is.false;
  // });

  // test('DefaultExport with namespace', () => {
  //   expect(tree.children[0].children[6])
  //     .to.have.own.property('name')
  //     .that.is.equal('DefaultExport');
  //   expect(tree.children[0].children[6]).to.have.own.property('thirdParty').that.is.false;
  // });
});
