/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from 'react';

// imports for the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowCircleRight, faStore } from '@fortawesome/free-solid-svg-icons';

// imports for the tooltip
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

// import tree for recursive calls
// eslint-disable-next-line import/no-cycle
import Tree from './Tree';
import { Tree as TreeType } from '../../types/Tree';

const TreeNode = ({ node }: { node: TreeType }): JSX.Element => {
  // state variables for the users current active file and the expanded value (boolean) of the node
  const [currFile, setCurrFile] = useState(false);
  const [expanded, setExpanded] = useState(node.expanded);

  // useEffect that will add an event listener for 'message' to each node, in order to show which file the user is currently working in
  useEffect(() => {
    window.addEventListener('message', (event: { data: { type: string; value: unknown } }) => {
      const message = event.data;
      switch (message.type) {
        case 'current-tab': {
          // If the current node's filePath is the same as the user's current actie window, change state to true, else, change state to false
          if (message.value === node.filePath) {
            setCurrFile(true);
          } else {
            setCurrFile(false);
          }
        }
      }
    });
    // Send message to the extension for the bolding
    tsvscode.postMessage({
      type: 'onBoldCheck',
      value: null,
    });
  });

  // Function that will capture the file path of the current node clicked on + send a message to the extension
  const viewFile = () => {
    // Edge case to verify that there is in fact a file path for the current node
    if (node.filePath) {
      tsvscode.postMessage({
        type: 'onViewFile',
        value: node.filePath,
      });
    }
  };

  // Function that generates the props for each node
  const propsGenerator = () => {
    // Case when there are no props present on the node
    if (Object.keys(node.props).length === 0) {
      return <p>None</p>;
    }
    // Case when there are props to loop through on the node
    return Object.keys(node.props).map((prop) => {
      return <p key={node.id}>{prop}</p>;
    });
  };

  // Variable that holds the props that will be fed into the tooltip (Tippy)
  const propsList = propsGenerator();

  // Variable that holds the logic of whether the current node has children or not
  const child = node.children.length > 0;

  // onClick method for each node that will change the expanded/collapsed structure + send a message to the extension
  const toggleNode = () => {
    // Set state with the opposite of what is currently saved in state (expanded)
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    // Send a message to the extension on the changed checked value of the current node
    tsvscode.postMessage({
      type: 'onNodeToggle',
      value: { id: node.id, expanded: newExpanded },
    });
  };

  const classString = 'tree_label' + (node.error ? ' node_error' : '');

  const FileNodeIcons = () =>
    useMemo((): JSX.Element | null => {
      return (
        /* Checks to make sure there are no thirdParty or reactRouter node_icons */
        !node.thirdParty && !node.reactRouter ? (
          <>
            {node.reduxConnect ? (
              <Tippy
                content={
                  <p>
                    <strong>Connected to Redux Store</strong>
                  </p>
                }
              >
                <a className="redux_connect" href="">
                  <FontAwesomeIcon icon={faStore} />
                </a>
              </Tippy>
            ) : null}
            <Tippy
              content={
                <p>
                  <strong>Props available:</strong>
                  {propsList}
                </p>
              }
            >
              <a className="node_icons" href="">
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </Tippy>
            <a className="node_icons" href="" onClick={viewFile}>
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </a>
          </>
        ) : null
      );
    }, []);

  // Render section
  return (
    <>
      {/* Conditional to check whether there are children or not on the current node */}
      {child ? (
        <li>
          <input type="checkbox" checked={expanded} id={node.id} onClick={toggleNode} />
          {/* Checks for the user's current active file */}
          {currFile ? (
            <label className={classString} htmlFor={node.id}>
              <strong style={{ fontWeight: 800 }}>{node.name}</strong>
            </label>
          ) : (
            <label className={classString} htmlFor={node.id}>
              {node.name}
            </label>
          )}
          <FileNodeIcons />
          <Tree data={node.children} first={false} />
        </li>
      ) : (
        <li>
          {/* Checks for the user's current active file */}
          {currFile ? (
            <span className={classString}>
              <strong style={{ fontWeight: 800 }}>{node.name}</strong>
            </span>
          ) : (
            <span className={classString}>{node.name}</span>
          )}
          <FileNodeIcons />
        </li>
      )}
    </>
  );
};

export default TreeNode;
