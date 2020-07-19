import * as vscode from 'vscode';
import { Config } from './features/config';
import { addToSelectsInActiveEditor } from './features/selects';

export function activate(context: vscode.ExtensionContext) {
	const config = new Config();

	const sortedAscending = vscode.commands.registerCommand('selects.incrementSortedAscending', () => {
		addToSelectsInActiveEditor({ sorted: true, trailing: config.incrementTrailing });
	});

	const sortedDescending = vscode.commands.registerCommand('selects.incrementSortedDescending', () => {
		addToSelectsInActiveEditor({ sorted: true, ascending: false, trailing: config.incrementTrailing });
	});

	const unsorted = vscode.commands.registerCommand('selects.incrementUnsorted', () => {
		addToSelectsInActiveEditor({ trailing: config.incrementTrailing });
	});

	const insertString = vscode.commands.registerCommand('selects.insertString', async () => {
		let insertString = await vscode.window.showInputBox({
			prompt: 'Create a value that will be added to the start of each selection.'
		});
		addToSelectsInActiveEditor({ insertString, trailing: config.insertTrailing });
	});

	context.subscriptions.push(
		sortedAscending,
		sortedDescending,
		unsorted,
		insertString
	);
}

export function deactivate() { }