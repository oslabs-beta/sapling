import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import * as ReactDOM from 'react-dom';
import Tree from './Tree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

const TreeNode = ({ node }: any) => {
  const [currFile, setCurrFile] = useState(false);
  const [expanded, setExpanded] = useState(node.expanded);
  const child = node.children.length > 0 ? true: false;
  // console.log('these are the settings in each node: ', node.name, node.thirdParty, node.reactRouter);
  // function that sends a message to the extension to open the file
  useEffect(() => {
    // listener for the postMessage that sends the file currently open on the users computer
    window.addEventListener('message', (event) => {
      // const localNode = node;
      // console.log(localNode);
      const message = event.data;
      switch (message.type) {
        case("current-tab"): {
          if (message.value === node.filePath) {
            setCurrFile(true);
          } else {
            setCurrFile(false);
          }
        }
      }
    });
  }, []);
  const viewFile = () => {
    if (node.filePath) {
      tsvscode.postMessage({
        type: "onViewFile",
        value: node.filePath
      });
    }
  };
  const propsGenerator = () => {
    if (Object.keys(node.props).length === 0) {
      return <p>None</p>;
    }
    return Object.keys(node.props).map(prop => {
      return <p>{prop}</p>;
    });
  };
  const propsList = propsGenerator();

  const toggleNode = () => {
    // toggle the change based on the current checked value
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    // send a message to the extension on the changed checked value of the current node
    tsvscode.postMessage({
        type: "onNodeToggle",
        value: {id: node.id, expanded: newExpanded}
    });
  };

  return (
    <>
      {child ? (
        <li>
          <input type="checkbox" checked={expanded} id={node.id} onClick={toggleNode} />
          {currFile ?
            <label className="tree_label" htmlFor={node.id}><strong style={{ fontWeight: 800 }}>{node.name}</strong></label>
            :
            <label className="tree_label" htmlFor={node.id}>{node.name}</label>}
          {!node.thirdParty && !node.reactRouter ? (
            <Fragment>
              <Tippy content={<p><strong>Props available:</strong>{propsList}</p>}>
                <a className="node_icons" href=""><FontAwesomeIcon icon={faInfoCircle} /></a>
              </Tippy>
              <a className="node_icons" href="" onClick={viewFile}><FontAwesomeIcon icon={faArrowCircleRight} /></a>
            </Fragment>
          ): null}
          <Tree data={node.children} first={false} />
        </li>
      ):
        <li>
          {currFile ?
            <span className="tree_label"><strong style={{ fontWeight: 800 }}>{node.name}</strong></span>
          : <span className="tree_label">{node.name}</span>
          }
          {!node.thirdParty && !node.reactRouter ? (
            <Fragment>
              <Tippy content={<p><strong>Props available:</strong>{propsList}</p>}>
                <a className="node_icons" href=""><FontAwesomeIcon icon={faInfoCircle} /></a>
              </Tippy>
              <a className="node_icons" href="" onClick={viewFile}><FontAwesomeIcon icon={faArrowCircleRight} /></a>
            </Fragment>
          ): null}
        </li>
      }
    </>
  );
};

export default TreeNode;