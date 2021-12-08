import * as React from 'react';
import { Tree as TreeType } from '../../types/Tree';

// import for the nodes
import TreeNode from './TreeNode';

const Tree = ({
  data,
  updateTreeView,
  first,
}: {
  data: TreeType[];
  updateTreeView: Function;
  first: boolean;
}) => {
  // Render section
  return (
    <>
      {/* Checks if the current iteration is the first time being run (adding in ul if not, and without ul if it is the first time) */}
      {first ? (
        data.map((tree: TreeType) => {
          return (
            <TreeNode
              key={tree.id}
              updateTreeView={updateTreeView}
              node={tree}
            />
          );
        })
      ) : (
        <ul>
          {data.map((tree: TreeType) => {
            return (
              <TreeNode
                key={tree.id}
                updateTreeView={updateTreeView}
                node={tree}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Tree;
