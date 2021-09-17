import * as React from 'react';
import { useEffect, useState } from 'react';
import TreeNode from './TreeNode';

const Tree = ({ data, first }: any) => {
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