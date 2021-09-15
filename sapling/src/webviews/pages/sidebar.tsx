import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sidebar from '../components/Sidebar';

// declare global {
//   interface Window {
//     acquireVsCodeApi(): any;
//   }
// }

// const vscode = window.acquireVsCodeApi();

console.log('we did make it into sidebar.tsx');

ReactDOM.render(<Sidebar />, document.getElementById('root'));