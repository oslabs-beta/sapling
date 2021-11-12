// Function that generates random string of 32 chars to give unique keys to
// Sapling Webview Tree components
export function getNonce() : string {
  let text : string = "";
  const possible : string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
