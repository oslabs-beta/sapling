import * as React from 'react';
import { useEffect } from 'react';

const Tree = () => {
  useEffect(() => {
    // listener for the postMessage parsed-data
    // populate the tree based on the parsed-data value
  }, []);
  return (
    <ul className="tree">
      <li>
        <input type="checkbox" id="c1" />
        <label className="tree_label" htmlFor="c1" >Level 0</label>
        <ul>
          <li>
            <input type="checkbox" id="c2" />
            <label className="tree_label" htmlFor="c2">Level 1</label>
            <ul>
              <li><span className="tree_label">Level 2</span></li>
              <li><span className="tree_label">Level 2</span></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="c3" />
            <label className="tree_label" htmlFor="c3">Looong level 1 <br/>label text <br/>with line-breaks</label>
            <ul>
              <li><span className="tree_label">Level 2</span></li>
              <li>
                <input type="checkbox" id="c4"/>
                <label className="tree_label" htmlFor="c4"><span className="tree_custom">Specified tree item view</span></label>
                <ul>
                  <li><span className="tree_label">Level 3</span></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <input type="checkbox" id="c5" />
        <label className="tree_label" htmlFor="c5">Level 0</label>
        <ul>
          <li>
            <input type="checkbox" id="c6" />
            <label className="tree_label" htmlFor="c6">Level 1</label>
            <ul>
              <li><span className="tree_label">Level 2</span></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="c7" />
            <label className="tree_label" htmlFor="c7">Level 1</label>
            <ul>
              <li><span className="tree_label">Level 2</span></li>
              <li>
                <input type="checkbox" id="c8" />
                <label className="tree_label" htmlFor="c8">Level 2</label>
                <ul>
                  <li><span className="tree_label">Level 3</span></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default Tree;