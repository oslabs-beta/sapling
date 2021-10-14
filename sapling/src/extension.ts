import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

// Sapling extension is activated after vscode startup
export function activate(context: vscode.ExtensionContext) {
	// instantiating the sidebar webview
  const sidebarProvider = new SidebarProvider(context);

  // Create Build Tree Status Bar Button
	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right
	);
  item.tooltip = 'Generate hierarchy tree from current file';
	item.text = '$(list-tree) Build Tree';
	item.command = 'sapling.generateTree';
	item.show();

  // Register Sapling Sidebar Webview View
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "sapling-sidebar",
      sidebarProvider
    )
  );

  // Register command to generate tree from current file on status button click or from explorer context
	context.subscriptions.push(
		vscode.commands.registerCommand("sapling.generateTree", async (uri: vscode.Uri | undefined) => {
			await vscode.commands.executeCommand('workbench.view.extension.sapling-sidebar-view');
			sidebarProvider.statusButtonClicked(uri);
		})
	);

	// setting up a hotkey to refresh the extension without manual refresh -- for developer use
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('sapling.refresh', async () => {
	// 		// async call to close the sidebar
	// 		await vscode.commands.executeCommand('workbench.action.closeSidebar');
	// 		// async call to open the extension
	// 		await vscode.commands.executeCommand('workbench.view.extension.sapling-sidebar-view');
	// 		// open the webdev tools on create (ID for Open Webdev Tools)
	// 		setTimeout(() => {
	// 			vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools');
	// 		}, 500);
	// 	})
	// );
}

// this method is called when your extension is deactivated
export function deactivate() {}
