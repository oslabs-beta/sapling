import * as assert from 'assert';
import { SaplingParser } from '../../parser';
import { describe, suite , test, before} from 'mocha';
import { expect } from 'chai';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Parser Test Suite', () => {
	let parser, tree;

	describe('It initializes correctly', () => {
		before( () => {
			parser = new SaplingParser('/Users/jordan/Desktop/codesmith/sapling/sapling/src/test/test_apps/test_0/index.js');
		});
		
		test('A new instance of the parser class is an object', () => {
			expect(parser).to.be.an('object');
		});

		test('It initializes with a proper entry file and an undefined tree', () => {
			assert.strictEqual(parser.entryFile, '/Users/jordan/Desktop/codesmith/sapling/sapling/src/test/test_apps/test_0/index.js');
			assert.strictEqual(parser.tree, undefined);
		});
	});

	describe('It works for simple apps', () => {
		before( () => {
			parser = new SaplingParser('/Users/jordan/Desktop/codesmith/sapling/sapling/src/test/test_apps/test_0/index.js');
			tree = parser.parse();
		});

		test('Parsing returns a object tree that is not undefined', () => {
			assert.strictEqual(typeof tree, 'object');
			assert.notStrictEqual(tree, undefined);
		});

		test('Parsed tree has a property called name with value index and one child with name App', () => {
			assert.strictEqual(tree.name, 'index');
			assert.strictEqual(tree.children[0].name, 'App');
		});
	});

	describe('It works for 2 components', () => {
		before(() => {
			parser = new SaplingParser('/Users/jordan/Desktop/codesmith/sapling/sapling/src/test/test_apps/test_1/index.js');
			tree = parser.parse();
		});

		test('Parsed tree has a property called name with value index and one child with name App, which has its own child Main', () => {
			assert.strictEqual(tree.name, 'index');
			assert.strictEqual(tree.children[0].name, 'App');
			assert.strictEqual(tree.children[0].children[0].name, 'Main');
			assert.strictEqual(tree.children.length, 1);
		});

		test('Parsed tree children should equal the child components', () => {
			assert.strictEqual(tree.children.length, 1);
			assert.strictEqual(tree.children[0].children.length, 1);
		});

		test('Parsed tree depth is accurate', () => {
			assert.strictEqual(tree.depth, 0);
			assert.strictEqual(tree.children[0].depth, 1);
			assert.strictEqual(tree.children[0].children[0].depth, 2);
		});
	});
});
