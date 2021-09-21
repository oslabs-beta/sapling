import * as React from 'react';
import { useState, Fragment } from 'react';
import * as ReactDOM from 'react-dom';
import Tree from './Tree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

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
  const propsGenerator = () => {
    if (Object.keys(node.props).length === 0) {
      return <p>None</p>;
    }
    return Object.keys(node.props).map(prop => {
      return <p>{prop}</p>;
    });
  };
  const propsList = propsGenerator();
  return (
    <>
      {child ? (
        <li>
          <input type="checkbox" id={htmlId} />
          <label className="tree_label" htmlFor={htmlId} >{node.name}</label>
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
          <span className="tree_label">{node.name}</span>
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