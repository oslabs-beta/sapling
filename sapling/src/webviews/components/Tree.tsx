import * as React from 'react';

// eslint-disable-next-line import/no-cycle
import TreeNode from './TreeNode';
import { Tree as TreeType } from '../../types/Tree';

const Tree = ({ data, first }: { data: Array<TreeType>; first: boolean }): JSX.Element => {
  // Render section
  return (
    <>
      {/* Checks if the current iteration is the first time being run (adding in ul if not, and without ul if it is the first time) */}
      {first ? (
        data.map((tree: TreeType) => {
          return <TreeNode key={tree.id} node={tree} />;
        })
      ) : (
        <ul>
          {data.map((tree: TreeType) => {
            return <TreeNode key={tree.id} node={tree} />;
          })}
        </ul>
      )}
    </>
  );
};

export default Tree;
