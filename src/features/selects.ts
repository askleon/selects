import * as vscode from 'vscode';

export interface SelectOptions {
	sorted?: boolean;
	ascending?: boolean;
	insertString?: string;
	trailing?: string;
}

function getActiveEditor() {
	if (!vscode.window.activeTextEditor) {
		vscode.window.showInformationMessage('No active editor!');
		return undefined;
	}
	return vscode.window.activeTextEditor;
}

function createInsertString(value: number, options?: SelectOptions) {
	return `${options?.insertString ?? value}${options?.trailing ?? ""}`;
}

/**
 * Functions for adding number to the start of each selection in editor.
 */
export async function addToSelects(editor: vscode.TextEditor, options?: SelectOptions) {
	let selects = editor.selections;

	if (options?.sorted) {
		selects = selects.sort((a, b) => a.start.compareTo(b.start));
		selects = options.ascending === false ? selects.reverse() : selects;
	}

	await editor.edit(edit => {
		let increment = 1;
		selects.forEach((select) => {
			if (select.start.line === select.end.line) {
				edit.insert(select.start, createInsertString(increment++, options));
			} else {
				for (let i = select.start.line; i <= select.end.line; i++) {
					edit.insert(new vscode.Position(i, 0), createInsertString(increment++, options));
				}
			}
		});
	});

	return Promise.resolve(selects);
}

/**
 * Functions for adding number to the start of each selection in active editor.
 */
export async function addToSelectsInActiveEditor(options?: SelectOptions) {
	let editor = getActiveEditor();
	if (!editor) {
		return;
	}
	addToSelects(editor, options);
}