import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';

const Navbar = () => {
  // state that holds the file path for the parser
  const [fileName, setFileName] = useState();
  // function to set the filename in state
  const showFile = (e: any) => {
    setFileName(e.target.files[0].path);
  };
  // function to post a message to the extension that will pass the path of the file the user selected
  const fileMessage = () => {
    // console.log(fileName);
    if (fileName) {
      tsvscode.postMessage({
        type: "onFile",
        value: fileName
      });
    }
  };
  return (
    <div className="navbar">
      <input id="file_input" type="file" onChange={(e) => {showFile(e);}}></input>
      <button id="file_message" onClick={fileMessage}>Refresh</button>
    </div>
  );
};

export default Navbar;