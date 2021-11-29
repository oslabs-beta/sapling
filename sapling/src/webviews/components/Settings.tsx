import * as React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { SaplingSettings } from '../../types/SaplingSettings';

// Control settings for e.g. webpack / tsconfig aliasing in React application
const Settings = () => {
  const [saplingSettings, setSaplingSettings]: [SaplingSettings, Function] =
    useState({
      useAlias: false,
      appRoot: '',
      webpackConfig: '',
      tsConfig: '',
    });

  const settingsMessage = (settingName: string, value: string | boolean) => {
    if (settingName) {
      tsvscode.postMessage({
        type: 'settings',
        value: [settingName, value],
      });
    }
  };

  return (
    <div id="settings">
      <label htmlFor="alias-checkbox">Use webpack/tsconfig aliasing</label>
      <input
        type="checkbox"
        id="alias-checkbox"
        onChange={() => {
          settingsMessage('useAlias', !saplingSettings.useAlias);
          setSaplingSettings({
            ...saplingSettings,
            useAlias: !saplingSettings.useAlias,
          });
        }}
        checked={saplingSettings.useAlias}
      />

      <div className="settings-control">
        <label htmlFor="application-root">
          Select root directory for application:
        </label>
        <button
          id="application-root"
          className="inputfile"
          onClick={(e) => settingsMessage('appRoot', 'selectFile')}
          disabled={!saplingSettings.useAlias}
        >
          <FontAwesomeIcon icon={faDownload} />
          <strong>
            {saplingSettings.appRoot
              ? ` ${saplingSettings.appRoot}`
              : ' Choose folder...'}
          </strong>
        </button>
      </div>

      <div className="settings-control">
        <label htmlFor="webpack-config">Select webpack config file:</label>
        <button
          id="webpack-config"
          className="inputfile"
          onClick={() => settingsMessage('webPackConfig', 'setFile')}
          disabled={!saplingSettings.useAlias}
        >
          <FontAwesomeIcon icon={faDownload} />
          <strong>
            {saplingSettings.appRoot
              ? ` ${saplingSettings.appRoot}`
              : ' Choose webpack config file...'}
          </strong>
        </button>
      </div>

      <div className="settings-control">
        <label htmlFor="tsconfig">Select tsconfig file:</label>
        <button
          id="tsconfig"
          className="inputfile"
          onClick={() => settingsMessage('tsconfig', 'setFile')}
          disabled={!saplingSettings.useAlias}
        >
          <FontAwesomeIcon icon={faDownload} />
          <strong>
            {saplingSettings.appRoot
              ? ` ${saplingSettings.appRoot}`
              : ' Choose tsconfig file...'}
          </strong>
        </button>
      </div>
    </div>
  );
};

export default Settings;