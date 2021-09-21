import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  // state that holds the file path for the parser
  // const [fileName, setFileName] = useState();
  // function to set the filename in state
  // const showFile = (e: any) => {
  //   setFileName(e.target.files[0].path);
  // };
  // function to post a message to the extension that will pass the path of the file the user selected
  const fileMessage = (e: any) => {
    const fileLabel = document.querySelector('#strong_file');
    fileLabel.innerHTML = ' ' + e.target.files[0].name;
    const file = e.target.files[0].path;
    if (file) {
      tsvscode.postMessage({
        type: "onFile",
        value: file
      });
    }
  };
  return (
    <div className="navbar">
      {/* <input id="file_input" type="file" onChange={(e) => {showFile(e);}}></input>
      <button id="file_message" onClick={fileMessage}>Refresh</button> */}
      <input type="file" name="file" id="file" className="inputfile" onChange={(e) => {fileMessage(e);}}/>
      <label htmlFor="file"><FontAwesomeIcon icon={faDownload}/><strong id="strong_file"> Choose a file...</strong></label>
    </div>
  );
};

export default Navbar;
