import * as React from 'react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Tree from './Tree';

const Sidebar = () => {
  // state that holds the parsed data
  const [treeData, setTreeData]: any = useState();
  useEffect(() => {
    // listener for the postMessage that sends the parsed data in message.value
    window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.type) {
        case("parsed-data"): {
          setTreeData([message.value]);
        }
      }
    });

    tsvscode.postMessage({
      type: "onSaplingVisible",
      value: null
    });

  }, []);
  return (
    <div className="sidebar">
      <Navbar />
      <ul className="tree_beginning">
        {treeData ?
          <Tree data={treeData} first={true} />
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