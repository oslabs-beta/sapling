import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import Tree from './Tree';

const TreeNode = ({ node, htmlId }: any) => {
  const child = node.children.length > 0 ? true: false;
  return (
    <>
      {child ? (
        <li>
          <input type="checkbox" id={htmlId} />
          <label className="tree_label" htmlFor={htmlId} >{node.name}</label>
          <Tree data={node.children} first={false} />
        </li>
      ): 
        <li>
          <span className="tree_label">{node.name}</span>
        </li>
      }
    </>
  );
};

export default TreeNode;