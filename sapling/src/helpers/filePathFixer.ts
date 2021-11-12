import * as path from 'path';

// Helper function to fix file paths picked via input button in Sapling Webview
export function filePathFixer(filePath : string) : string {
  // Fix when selecting files in wsl file system
  if (process.platform === 'linux' && filePath.includes('wsl$')) {
    filePath = path.resolve(filePath.split(path.win32.sep).join(path.posix.sep));
    filePath = '/' + filePath.split('/').slice(3).join('/');
  // Fix for when running wsl but selecting files held on windows file system
  } else if (process.platform === 'linux' && (/[a-zA-Z]/).test(filePath[0])) {
    const root = `/mnt/${filePath[0].toLowerCase()}`;
    filePath = path.join(root, filePath.split(path.win32.sep).slice(1).join(path.posix.sep));
  }
  return filePath;
};
