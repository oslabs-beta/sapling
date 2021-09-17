import * as React from 'react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Tree from './Tree';

const testData: any = [
  {
    "name": "index",
    "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/index.js",
    "depth": 0,
    "children": [
      {
        "source": "test_0/components/App.jsx",
        "name": "App",
        "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/App.jsx",
        "children": [
          {
            "source": "Main.jsx",
            "name": "Main",
            "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
            "children": [],
            "depth": 2
          }
        ],
        "depth": 1
      },
      {
        "source": "random-test",
        "name": "TEST 1",
        "filename": "random-test",
        "children": [
          {
            "source": "random-test",
            "name": "TEST 2",
            "filename": "random-test",
            "children": [],
            "depth": 2
          },
          {
            "source": "random-test",
            "name": "TEST 3",
            "filename": "random-test",
            "children": [],
            "depth": 2
          }
        ],
        "depth": 1
      }
    ]
  },
  {
    "name": "TEST 4",
    "filename": "random-test",
    "depth": 0,
    "children": [
      {
        "source": "random-test",
        "name": "TEST 5",
        "filename": "random-test",
        "children": [],
        "depth": 1
      },
    ]
  },
];

const Sidebar = () => {
  // const [treeData, setTreeData]: any = useState();
  // useEffect(() => {
  //   // listener for the postMessage parsed-data
  //   // populate the tree based on the parsed-data value
  //   console.log('test tree at start:', testData);
  //   setTreeData(testData);
  // }, []);
  return (
    <div className="sidebar">
      <Navbar />
      <ul className="tree_beginning">
        <Tree data={testData} first={true} />
      </ul>
    </div>
  );
};

export default Sidebar;