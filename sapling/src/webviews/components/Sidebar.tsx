import React, { useEffect, useState } from 'react';
import { Tree as TreeType } from '../../types/Tree';

// component imports
import Navbar from './Navbar';
import Tree from './Tree';

const Sidebar = (): JSX.Element => {
  // state variables for the incomimg treeData, parsed viewData, user's settings, and the root file name
  const [treeData, setTreeData] = useState<Array<TreeType> | undefined>();
  const [viewData, setViewData] = useState<Array<TreeType> | undefined>();
  const [settings, setSettings] = useState<Record<'thirdParty' | 'reactRouter', boolean>>();
  const [rootFile, setRootFile] = useState<string | undefined>();

  // useEffect whenever the Sidebar is rendered
  useEffect(() => {
    // Event Listener for 'message' from the extension
    window.addEventListener('message', (event: { data: { type: string; value: unknown } }) => {
      const message = event.data;
      switch (message.type) {
        // Listener to receive the tree data, update navbar and tree view
        case 'parsed-data': {
          const newTree = message.value as TreeType;
          setRootFile(newTree.fileName);
          setTreeData([newTree]);
          break;
        }
        // Listener to receive the user's settings
        case 'settings-data': {
          setSettings(message.value as Record<'thirdParty' | 'reactRouter', boolean>);
          break;
        }
      }
    });

    // Post message to the extension whenever sapling is opened
    tsvscode.postMessage({
      type: 'onSaplingVisible',
      value: null,
    });

    // Post message to the extension for the user's settings whenever sapling is opened
    tsvscode.postMessage({
      type: 'onSettingsAcquire',
      value: null,
    });
  }, []);

  // Separate useEffect that gets triggered when the treeData and settings state variables get updated
  useEffect(() => {
    if (treeData && settings) {
      // Invoke parser to parse based on user's settings
      parseViewTree();
    }
  });

  // Edits and returns component tree based on users settings
  const parseViewTree = (): void => {
    if (!treeData || !treeData[0]) return;
    // Deep copy of the treeData passed in
    const treeParsed = JSON.parse(JSON.stringify(treeData[0])) as TreeType;

    // Helper function for the recursive parsing
    const traverse = (node: TreeType): void => {
      const validChildren = [];
      // Logic to parse the nodes based on the users settings
      for (let i = 0; i < node.children.length; i++) {
        if (
          node.children[i].thirdParty &&
          settings &&
          settings.thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        } else if (node.children[i].reactRouter && settings && settings.reactRouter) {
          validChildren.push(node.children[i]);
        } else if (!node.children[i].thirdParty && !node.children[i].reactRouter) {
          validChildren.push(node.children[i]);
        }
      }

      // Update children with only valid nodes, and recurse through each node
      node.children = validChildren;
      node.children.forEach((child: TreeType) => {
        traverse(child);
      });
    };

    // Invoking the helper function
    traverse(treeParsed);
    // Update the vewData state
    setViewData([treeParsed]);
  };

  // Render section
  return (
    <div className="sidebar">
      <Navbar rootFile={rootFile} />
      <hr className="line_break" />
      <div className="tree_view">
        <ul className="tree_beginning">
          {viewData && settings ? <Tree data={viewData} first={true} /> : null}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
