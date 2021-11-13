import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

// imports for the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ rootFile }: any) => {
  
  const fileMessage = () => {
    // tell the extension that the user wants to open a file
    tsvscode.postMessage({
        type: "onFile",
        value: null
    });
  };

  // Render section
  return (
    <div className="navbar">
      <button id="file" className="infputFile" onClick={() => fileMessage()}>
      <label htmlFor="file">
        <FontAwesomeIcon icon={faDownload}/>
        <strong id="strong_file">{rootFile ? ` ${rootFile}` : ' Choose a file...'}</strong>
      </label>
      </button>
    </div>
  );
};

export default Navbar;
