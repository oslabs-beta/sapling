import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import * as ReactDOM from 'react-dom';
import Tree from './Tree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

const TreeNode = ({ node, htmlId }: any) => {
  const [currFile, setCurrFile] = useState(false);
  const child = node.children.length > 0 ? true: false;
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
  }, [currFile]);
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
          {currFile ? 
            <label className="tree_label" htmlFor={htmlId}><strong style={{ fontWeight: 800 }}>{node.name}</strong></label>
            : 
            <label className="tree_label" htmlFor={htmlId}>{node.name}</label>}
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