import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

// imports for the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  // useEffect that adds and event listener for 'message' that will change the innerHTML of the file select button
  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.type) {
        case("saved-file"): {
          if (message.value) {
            const fileLabel = document.querySelector('#strong_file');
            fileLabel.innerHTML = ' ' + message.value;
          }
        }
      }
    });
  });

  // onChange function that will send a message to the extension when the user selects a file
  const fileMessage = (e: any) => {
    const fileLabel = document.querySelector('#strong_file');
    fileLabel.innerHTML = ' ' + e.target.files[0].name;
    const fileName = e.target.files[0].name;
    const filePath = e.target.files[0].path;
    if (filePath) {
      tsvscode.postMessage({
        type: "onFile",
        value: { fileName, filePath }
      });
    }
  };

  // Render section
  return (
    <div className="navbar">
      <input type="file" name="file" id="file" className="inputfile" onChange={(e) => {fileMessage(e);}}/>
      <label htmlFor="file">
        <FontAwesomeIcon icon={faDownload}/>
        <strong id="strong_file"> Choose a file...</strong>
      </label>
    </div>
  );
};

export default Navbar;
