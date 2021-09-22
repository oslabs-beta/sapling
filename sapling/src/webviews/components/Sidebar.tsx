import { parse } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Tree from './Tree';

const Sidebar = () => {
  // state that holds the parsed data
  const [treeData, setTreeData]: any = useState();
  const [viewData, setViewData]: any = useState();
  const [settings, setSettings]: any = useState();
  useEffect(() => {
    // console.log('entering useEffect inside of Sidebar');
    // listener for the postMessage that sends the parsed data in message.value
    window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.type) {
        case("parsed-data"): {
          // console.log('we are in the case for parsed-data', message.value);
          setTreeData([message.value]);
          break;
        }
        // when we get message back regarding settings, we can update state variables to then conditionally render html
        case("settings-data"): {
          // console.log('we are receiving the message back from the extension: ', message.value);
          setSettings(message.value);
          break;
        }
      }
    });

    tsvscode.postMessage({
      type: "onSaplingVisible",
      value: null
    });

    tsvscode.postMessage({
      type: "onSettingsAcquire",
      value: null
    });
    
  }, []);

  // Run this function whenever treeData changes
  useEffect(() => {
    // console.log('Immediate value of TreeData is: ', treeData);
    if (treeData && settings) {
      parseViewTree();
    }
  }, [treeData, settings]);

  // Edits and returns component tree based on users settings
  const parseViewTree = () : void => {
    // console.log('this is the value of the treeData passed into parseViewTree: ', treeData);
    // console.log('these are the current settings saved in state: ', settings);
    const treeParsed = JSON.parse(JSON.stringify(treeData[0]));
    
    const traverse = (node: any) : void => {
      let validChildren = [];

      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].thirdParty && settings.thirdParty && !node.children[i].reactRouter) {
          validChildren.push(node.children[i]);
        } else if (node.children[i].reactRouter && settings.reactRouter) {
          validChildren.push(node.children[i]);
        } else if (!node.children[i].thirdParty && !node.children[i].reactRouter) {
          validChildren.push(node.children[i]);
        }
      }

      //   if ((node.children[i].thirdParty && settings.thirdParty) && (node.children[i].reactRouter && settings.reactRouter)) {
      //     validChildren.push(node.children[i]);
      //   } else if (!node.children[i].thirdParty && !node.children[i].reactRouter) {
      //     validChildren.push(node.children[i]);
      //   }
      // }

      // Update children with only valid nodes, and recurse through each node
      node.children = validChildren;
      node.children.forEach((child: any) => {
        traverse(child);
      });
    };

    traverse(treeParsed);
    setViewData([treeParsed]);
  };
    

  return (
    <div className="sidebar">
      <Navbar />
      <ul className="tree_beginning">
        {viewData && settings ?
          <Tree data={viewData} first={true} />
        : null}
      </ul>
    </div>
  );
};

export default Sidebar;

//   <ul className="tree">
//     <li>
//       <input type="checkbox" id="c1" />
//       <label className="tree_label" htmlFor="c1" >Level 0</label>
//       <ul>
//         <li>
//           <input type="checkbox" id="c2" />
//           <label className="tree_label" htmlFor="c2">Level 1</label>
//           <ul>
//             <li><span className="tree_label">Level 2</span></li>
//             <li><span className="tree_label">Level 2</span></li>
//           </ul>
//         </li>
//         <li>
//           <input type="checkbox" id="c3" />
//           <label className="tree_label" htmlFor="c3">Looong level 1 <br/>label text <br/>with line-breaks</label>
//           <ul>
//             <li><span className="tree_label">Level 2</span></li>
//             <li>
//               <input type="checkbox" id="c4"/>
//               <label className="tree_label" htmlFor="c4"><span className="tree_custom">Specified tree item view</span></label>
//               <ul>
//                 <li><span className="tree_label">Level 3</span></li>
//               </ul>
//             </li>
//           </ul>
//         </li>
//       </ul>
//     </li>
//     <li>
//       <input type="checkbox" id="c5" />
//       <label className="tree_label" htmlFor="c5">Level 0</label>
//       <ul>
//         <li>
//           <input type="checkbox" id="c6" />
//           <label className="tree_label" htmlFor="c6">Level 1</label>
//           <ul>
//             <li><span className="tree_label">Level 2</span></li>
//           </ul>
//         </li>
//         <li>
//           <input type="checkbox" id="c7" />
//           <label className="tree_label" htmlFor="c7">Level 1</label>
//           <ul>
//             <li><span className="tree_label">Level 2</span></li>
//             <li>
//               <input type="checkbox" id="c8" />
//               <label className="tree_label" htmlFor="c8">Level 2</label>
//               <ul>
//                 <li><span className="tree_label">Level 3</span></li>
//               </ul>
//             </li>
//           </ul>
//         </li>
//       </ul>
//     </li>
//   </ul>


// const testData: any = [
//   {
//     "name": "index",
//     "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/index.js",
//     "depth": 0,
//     "children": [
//       {
//         "source": "test_0/components/App.jsx",
//         "name": "App",
//         "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/App.jsx",
//         "children": [
//           {
//             "source": "Main.jsx",
//             "name": "Main",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [],
//             "depth": 2
//           },
//           {
//             "source": "Main.jsx",
//             "name": "TEST 1",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [],
//             "depth": 2
//           }
//         ],
//         "depth": 1
//       },
//       {
//         "source": "test_0/components/App.jsx",
//         "name": "TEST 2",
//         "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/App.jsx",
//         "children": [
//           {
//             "source": "Main.jsx",
//             "name": "TEST 3",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [],
//             "depth": 2
//           },
//           {
//             "source": "Main.jsx",
//             "name": "TEST 4",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [
//               {
//                 "source": "Main.jsx",
//                 "name": "TEST 5",
//                 "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//                 "children": [],
//                 "depth": 3
//               },
//             ],
//             "depth": 2
//           }
//         ],
//         "depth": 1
//       },
//     ]
//   },
//   {
//     "name": "TEST 6",
//     "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/index.js",
//     "depth": 0,
//     "children": [
//       {
//         "source": "test_0/components/App.jsx",
//         "name": "Test 7",
//         "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/App.jsx",
//         "children": [
//           {
//             "source": "Main.jsx",
//             "name": "TEST 8",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [],
//             "depth": 2
//           },
//         ],
//         "depth": 1
//       },
//       {
//         "source": "test_0/components/App.jsx",
//         "name": "TEST 9",
//         "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/App.jsx",
//         "children": [
//           {
//             "source": "Main.jsx",
//             "name": "TEST 10",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [],
//             "depth": 2
//           },
//           {
//             "source": "Main.jsx",
//             "name": "TEST 11",
//             "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//             "children": [
//               {
//                 "source": "Main.jsx",
//                 "name": "TEST 12",
//                 "filename": "/home/plcoster/Coding-Ubuntu/Codesmith/parser_tests/test_0/components/Main.jsx",
//                 "children": [],
//                 "depth": 3
//               },
//             ],
//             "depth": 2
//           }
//         ],
//         "depth": 1
//       },
//     ]
//   }
// ];