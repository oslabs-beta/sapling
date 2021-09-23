import * as React from 'react';
import { useEffect, useState } from 'react';

// import for the nodes
import TreeNode from './TreeNode';

const Tree = ({ data, first }: any) => {
  // Render section
  return (
    <>
    {/* Checks if the current iteration is the first time being run (adding in ul if not, and without ul if it is the first time) */}
      {first ? data.map((tree: any) => {
          return <TreeNode key={tree.id} node={tree}/>;
        }):
        <ul>
          {data.map((tree: any) => {
            return <TreeNode key={tree.id} node={tree}/>;
          })}
        </ul>
      }
    </>
  );
};

export default Tree;
