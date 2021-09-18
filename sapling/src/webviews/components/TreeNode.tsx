import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import Tree from './Tree';

const TreeNode = ({ node, htmlId }: any) => {
  const child = node.children.length > 0 ? true: false;
  // function that sends a message to the extension to open the file
  
  const viewFile = () => {
    if (node.filePath) {
      tsvscode.postMessage({
        type: "onViewFile",
        value: node.filePath
      });
    }
  };

  return (
    <>
      {child ? (
        <li>
          <input type="checkbox" id={htmlId} />
          <label className="tree_label" htmlFor={htmlId} >{node.name}</label>
          <button className="file_button" onClick={viewFile}>open</button>
          <button className="prop_button">{'>'}</button>
          <Tree data={node.children} first={false} />
        </li>
      ): 
        <li>
          <span className="tree_label">{node.name}</span>
          <button className="file_button" onClick={viewFile}>open</button>
          <button className="prop_button">{'>'}</button>
        </li>
      }
    </>
  );
};

export default TreeNode;