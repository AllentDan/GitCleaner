// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

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

	private get_target_dir(dir: string, target_suffix: string[] = ['.pyc']) {

		const results: Array<string> = [];
		const tree = function (target: string, deep: Array<boolean> = []) {
			const child = fs.readdirSync(target).filter(el => !el.startsWith('.'));
			if (child.length == 1 && child.indexOf('__pycache__') != -1) {
				results.push(target);
			}
			var direct: Array<string> = [];
			child.forEach(function (el) {
				const dir = path.join(target, el);
				const stat = fs.statSync(dir);
				if (!stat.isFile()) {
					direct.push(el);
				}
			})
			direct.forEach(function (el, i) {
				const dir = path.join(target, el);
				tree(dir);
			})
		}
		tree(dir)
		return results;
	}

	public async delete_pycache(): Promise<GitCleaner> {
		var projects = this.getProjectRoots();
		if (projects == []) return this;
		for (let i = 0; i < projects.length; i++) {
			let targets = this.get_target_dir(projects[i], ['.pyc']);
			targets.forEach(async function (el) {
				console.log(el);
				const edit = new vscode.WorkspaceEdit();
				edit.deleteFile(vscode.Uri.parse(el), { recursive: true, ignoreIfNotExists: true });
				await vscode.workspace.applyEdit(edit);
			})
		}
		return this;
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

// this method is called when your extension is deactivated
export function deactivate() { }
