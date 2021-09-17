import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import Tree from './Tree';

const TreeNode = ({ node, htmlId }: any) => {
  console.log('received this in TreeNode', node);
  const child = node.children.length > 0 ? true: false;
  return (
    <>
      {child ? (
        <li>
          <input type="checkbox" id={htmlId} />
          <label className="tree_label" htmlFor={htmlId} >{node.name}</label>
        </li>
      ): <span className="tree_label">{node.name}</span>}
      {child ? (
        <Tree data={node.children} first={false} />
      ): null}
    </>
  );
};

export default TreeNode;