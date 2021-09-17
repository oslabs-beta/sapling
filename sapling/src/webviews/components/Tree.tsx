import * as React from 'react';
import { useEffect, useState } from 'react';
import TreeNode from './TreeNode';

const Tree = ({ data, first }: any) => {
  console.log('data received inside of Tree:', data);
  const idRandomizer = () => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  return (
    <>
      {first ? data.map((tree: any, i: any) => {
          const uniqueId = idRandomizer();
          return <TreeNode node={tree} htmlId={uniqueId} />;
        }):
        <ul>
          {data.map((tree: any, i: any) => {
            const uniqueId = idRandomizer();
            return <TreeNode node={tree} htmlId={uniqueId} />;
          })}
        </ul>
      }
    </>
  );
};

export default Tree;

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