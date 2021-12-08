import * as React from 'react';
import { useEffect, useState } from 'react';
import { Tree as TreeType } from '../../types/Tree';
import { SaplingSettings } from '../../types/SaplingSettings';

// component imports
import ExpandableMenu from './ExpandableMenu';
import Navbar from './Navbar';
import Settings from './Settings';
import Tree from './Tree';

const Sidebar = () => {
  // state variables for the incomimg treeData, parsed viewData, user's global VSCode preferences, local webview settings, and the root file name
  const [treeData, setTreeData]: [TreeType[], Function] = useState();
  const [viewData, setViewData]: [TreeType[], Function] = useState();
  const [preferences, setPreferences]: [{ [key: string]: boolean }, Function] =
    useState();
  const [settings, setSettings]: [SaplingSettings, Function] = useState({
    useAlias: false,
    appRoot: '',
    webpackConfig: '',
    tsConfig: '',
  });
  const [rootFile, setRootFile]: [string, Function] = useState();

  // useEffect whenever the Sidebar is rendered
  useEffect(() => {
    // Event Listener for 'message' from the extension
    window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.type) {
        // Listener to receive the tree data, update navbar and tree view
        case 'parsed-data': {
          // If no message value (e.g. resetting workspace data), set default vals:
          if (!message.value) {
            setRootFile();
            setTreeData();
            setViewData();
          } else {
            setRootFile(message.value.fileName);
            setTreeData([message.value]);
          }

          break;
        }
        // Listener to receive the user's VS Code Preferences
        case 'preferences-data': {
          setPreferences(message.value);
          break;
        }
        // Listerner to receive the user's local parser settings
        case 'settings-data': {
          setSettings(message.value);
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
      type: 'onPreferencesAcquire',
      value: null,
    });
  }, []);

  // Separate useEffect that gets triggered when the treeData and settings state variables get updated
  useEffect(() => {
    if (treeData && preferences) {
      // Invoke parser to parse based on user's settings
      parseViewTree();
    }
  }, [treeData, preferences]);

  // Edits and returns component tree based on users settings
  const parseViewTree = (): void => {
    // Deep copy of the treeData passed in
    const treeParsed = JSON.parse(JSON.stringify(treeData[0]));

    // Helper function for the recursive parsing
    const traverse = (node: any): void => {
      let validChildren = [];

      // Logic to parse the nodes based on the users settings
      for (let i = 0; i < node.children.length; i++) {
        if (
          node.children[i].thirdParty &&
          preferences.thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        } else if (node.children[i].reactRouter && preferences.reactRouter) {
          validChildren.push(node.children[i]);
        } else if (
          !node.children[i].thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        }
      }

      // Update children with only valid nodes, and recurse through each node
      node.children = validChildren;
      node.children.forEach((child: any) => {
        traverse(child);
      });
    };

    // Invoking the helper function
    traverse(treeParsed);
    // Update the vewData state
    setViewData([treeParsed]);
  };

  // Function to update the webview tree view state when a node is toggled
  const updateTreeView = () => {
    setViewData(viewData);
  };

  return (
    <div className="sidebar">
      <hr className="line_break" />

      <ExpandableMenu controlName="FILE SELECTOR" initState={true}>
        <Navbar rootFile={rootFile} />
      </ExpandableMenu>

      <ExpandableMenu controlName="SETTINGS" initState={true}>
        <Settings saplingSettings={settings} />
      </ExpandableMenu>

      <ExpandableMenu controlName="TREE VIEW" initState={true}>
        <div className="tree_view">
          <ul className="tree_beginning">
            {viewData && preferences ? (
              <Tree
                data={viewData}
                updateTreeView={updateTreeView}
                first={true}
              />
            ) : (
              'Please Select a React file to view component tree'
            )}
          </ul>
        </div>
      </ExpandableMenu>
    </div>
  );
};

export default Sidebar;
