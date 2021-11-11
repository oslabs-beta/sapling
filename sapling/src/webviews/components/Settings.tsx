import * as React from 'react';
import { useEffect, useState } from 'react';

// Control settings for e.g. webpack / tsconfig aliasing in React application
const Settings = () => {
  const [useAliasing, setUseAliasing] = useState(false);

  const fileMessage = (e : any) => {
    const fileType = e.target.id;
    const filePath = e.target.files[0].path;

    if (fileType && filePath) {
      tsvscode.postMessage({
        type: 'config',
        value: [fileType, filePath]
      });
    }
  };

  return (
    <>
      <label htmlFor="alias-checkbox">
        Use webpack/tsconfig aliasing
        <input
          type="checkbox"
          id="alias-checkbox"
          onChange={() => setUseAliasing(!useAliasing)}
          checked={useAliasing}
        />
      </label>

      <label htmlFor="application-root">
        Select root folder for application:
        <input type="file" id="application-root" disabled={!useAliasing} onChange={(e) => {fileMessage(e);}}/>
      </label>

      <label htmlFor="webpack-config">
        Select webpack config file:
        <input type="file" id="webpack-config" disabled={!useAliasing} onChange={(e) => {fileMessage(e);}}/>
      </label>

      <label htmlFor="tsconfig">
        Select tsconfig file:
        <input type="file" id="tsconfig" disabled={!useAliasing} onChange={(e) => {fileMessage(e);}}/>
      </label>
    </>
  );
};

export default Settings;
