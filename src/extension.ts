// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';


function get_single_parent_folder(dir: string): string {
	const parent = path.dirname(dir);
	const child = fs.readdirSync(parent).filter(el => !el.startsWith('.'));
	if (child.length == 1) {
		return get_single_parent_folder(parent);
	} else {
		return dir;
	}
}

class GitCleaner {
	constructor() {
	}
	private getProjectRoots() {
		let projects: string[] = [];
		if (vscode.workspace.workspaceFolders !== undefined) {
			for (let i = 0; i < vscode.workspace.workspaceFolders.length; i++) {
				projects.push(vscode.workspace.workspaceFolders[i].uri.fsPath);
			}
		}
		return projects;
	}

	public async delete_pycache() {

		const tree = async function (target: string) {
			const child = fs.readdirSync(target).filter(el => !el.startsWith('.'));
			if (child.length == 1 && child.indexOf('__pycache__') != -1) {
				const result = get_single_parent_folder(target);
				console.log(result);
				const edit = new vscode.WorkspaceEdit();
				edit.deleteFile(vscode.Uri.parse(result), { recursive: true, ignoreIfNotExists: true });
				await vscode.workspace.applyEdit(edit);
			}
			var direct: Array<string> = [];
			child.forEach(function (el) {
				const _dir = path.join(target, el);
				const stat = fs.statSync(_dir);
				if (!stat.isFile()) {
					direct.push(el);
				}
			})
			direct.forEach(function (el, i) {
				const _dir = path.join(target, el);
				tree(_dir);
			})
		}		
		var projects = this.getProjectRoots();
		if (projects == []) return this;
		for (let i = 0; i < projects.length; i++) {
			tree(projects[i]);
		}
	}
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
	let cleaner = new GitCleaner()
	let disposable = vscode.commands.registerCommand('gitcleaner.removePycache', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		cleaner.delete_pycache();
		vscode.window.showInformationMessage('Done by GitCleaner!');
	});

	context.subscriptions.push(disposable);
}

