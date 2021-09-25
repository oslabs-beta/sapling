import * as assert from 'assert';
import * as vscode from 'vscode';
import {describe} from 'mocha';
import {render, screen} from '@testing-library/react';
import * as React from 'react';
import Navbar from '../../webviews/components/Navbar';

// import * as myExtension from '../../extension';

describe('React Component Unit Tests', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('loads a navbar', () => {
		const {getByRole} = render(<Navbar/>);
		// getByRole('navigation');
		
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Sample test 2', () => {
		assert.strictEqual(1, 1);
	});

});