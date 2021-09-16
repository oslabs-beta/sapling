import { readFileSync } from "fs";
import * as vscode from "vscode";
import { getNonce } from "./getNonce";
const fs = require('fs');

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  // this instantiates the connection to the webview
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    // reaches out to the project file connecter function below
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // message section that will listen for messages sent from the React components to communicate with the extension
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        // case to respond to the message from the webview
        case "onFile": {
          if (!data.value) {
            return;
          }
          console.log('extension has received: ', data.value);
          fs.readFileSync(data.value, 'utf-8', (err: any, data: any) => {
            console.log(data);
          });
          // run the parser passing in the data.value information
          // const parsed = parser(data.value);
          // // pass the parser result into the value of the postMessage
          // webviewView.webview.postMessage({
          //   type: "parsed-data",
          //   value: parsed
          // });
          break;
        }
      }
    });
  }

  // revive statement for the webview panel
  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  // paths and return statement that connects the webview to React project files
  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "styles.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "sidebar.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" 
          content="default-src 'none'; 
          style-src 'unsafe-inline' ${webview.cspSource}; 
          img-src ${webview.cspSource} https:;
          script-src 'nonce-${nonce}';">
          <link href="${styleResetUri}" rel="stylesheet">
          <link href="${styleVSCodeUri}" rel="stylesheet">
          <link href="${styleMainUri}" rel="stylesheet">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
        <div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}