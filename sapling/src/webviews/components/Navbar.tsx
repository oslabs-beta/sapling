import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';

const Navbar = () => {
  const [fileName, setFileName] = useState();
  const showFile = (e: any) => {
    // e.preventDefault();
    // const reader = new FileReader();
    // reader.onload = async (e) => {
    //   const text = (e.target.result);
    //   console.log(text);
    // };
    // reader.readAsText(e.target.files[0]);
    console.log(e.target.files[0]);
    setFileName(e.target.files[0].path);
  };
  const fileMessage = () => {
    console.log(fileName);
    if (fileName) {
      tsvscode.postMessage({
        type: "onFile",
        value: fileName
      });
    }
  };
  return (
    <div className="navbar">
      <input id="file_input" type="file" placeholder="File entry point..." onChange={(e) => {showFile(e);}}></input>
      <button id="file_message" onClick={fileMessage}>Refresh</button>
    </div>
  );
};

export default Navbar;