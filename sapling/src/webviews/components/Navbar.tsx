import * as React from 'react';

// imports for the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ rootFile }: any) => {
  // Send message from webview to extension to open file selector
  const fileMessage = () => {
    tsvscode.postMessage({
      type: 'onFile',
      value: null,
    });
  };

  // Render section
  return (
    <div id="navbar">
      <div className="settings-control">
        <label htmlFor="file"> Select React File for Tree Root:</label>
        <button id="file" className="inputfile" onClick={() => fileMessage()}>
          <FontAwesomeIcon icon={faDownload} />
          <strong>{rootFile ? ` ${rootFile}` : ' Choose a file...'}</strong>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
