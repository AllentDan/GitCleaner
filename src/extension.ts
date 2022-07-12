// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Console } from 'console';
import { privateEncrypt } from 'crypto';
import * as vscode from 'vscode';
var exec = require('child-process-promise').exec;


function getProjectRoot() {
	if (vscode.workspace.workspaceFolders !== undefined) {
		let currentWorkspaceFolder: string = '';
		let currentlyOpenTabfilePath: string = '';
		if (vscode.window.activeTextEditor !== undefined)
			currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {
			const index_out = currentlyOpenTabfilePath.indexOf(vscode.workspace.workspaceFolders[i].uri.fsPath);
			if (index_out == 0) {
				currentWorkspaceFolder = vscode.workspace.workspaceFolders[i].uri.fsPath;
				return currentWorkspaceFolder
			}
		}
	}
	return '';
}

async function log() {
	var project_root = getProjectRoot();
	if (project_root == '') return;
	var res = await exec(`cd ${project_root} && git branch`, { timeout: 999 });
	console.log(res);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gitcleaner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gitcleaner.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from GitCleaner!');
		log();
		vscode.window.showInformationMessage(getProjectRoot());
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
