import React from 'react';

// imports for the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// HTML5 API File interface lacks a 'path' attribute, but electron adds one.
// https://www.electronjs.org/docs/latest/api/file-object/
// With this interface, ts compiler gets the memo.
interface FileElectron extends File {
  readonly path?: string;
}

const Navbar = ({ rootFile }: Record<'rootFile', string | undefined>): JSX.Element => {
  // onChange function that will send a message to the extension when the user selects a file

  const fileMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    const file: FileElectron = e.target.files[0];
    const filePath: string | undefined = file.path;
    // Reset event target value to empty string so the same file selection causes onChange event to trigger
    e.target.value = '';
    if (filePath && filePath.length) {
      tsvscode.postMessage({
        type: 'onFile',
        value: filePath,
      });
    }
  };

  // Render section
  return (
    <div className="navbar">
      <input
        type="file"
        name="file"
        id="file"
        className="inputfile"
        onChange={(e) => {
          fileMessage(e);
        }}
      />
      <label htmlFor="file">
        <FontAwesomeIcon icon={faDownload} />
        <strong id="strong_file">{rootFile ? ` ${rootFile}` : ' Choose a file...'}</strong>
      </label>
    </div>
  );
};

export default Navbar;
