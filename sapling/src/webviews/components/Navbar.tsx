import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

// imports for the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ rootFile }: any) => {
  // onChange function that will send a message to the extension when the user selects a file
  const fileMessage = (e: any) => {
    const filePath = e.target.files[0].path;
    // Reset event target value to null so the same file selection causes onChange event to trigger
    e.target.value = null;
    if (filePath) {
      tsvscode.postMessage({
        type: "onFile",
        value: filePath
      });
    }
  };

  // Render section
  return (
    <div className="navbar">
      <input type="file" name="file" id="file" className="inputfile" onChange={(e) => {fileMessage(e);}}/>
      <label htmlFor="file">
        <FontAwesomeIcon icon={faDownload}/>
        <strong id="strong_file">{rootFile ? ` ${rootFile}` : ' Choose a file...'}</strong>
      </label>
    </div>
  );
};

export default Navbar;
