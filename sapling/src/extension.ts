import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// instantiating the sidebar webview
  const sidebarProvider = new SidebarProvider(context);

	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right
	);
	item.text = '$(list-tree) Build Tree';
	item.command = 'sapling.generateTree';
	item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "sapling-sidebar",
      sidebarProvider
    )
  );

	context.subscriptions.push(
		vscode.commands.registerCommand("sapling.generateTree", async () => {
			await vscode.commands.executeCommand('workbench.view.extension.sapling-sidebar-view');
			sidebarProvider.statusButtonClicked();
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
