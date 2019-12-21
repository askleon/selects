import * as assert from 'assert';
import * as vscode from 'vscode';
import { SelectOptions, addToSelects } from '../../features/selects';

const selections = [
	new vscode.Selection(
		new vscode.Position(2, 0),
		new vscode.Position(2, 0)
	),
	new vscode.Selection(
		new vscode.Position(0, 0),
		new vscode.Position(0, 0)
	),
	new vscode.Selection(
		new vscode.Position(1, 0),
		new vscode.Position(1, 0)
	)
];

async function getValues(options?: SelectOptions) {
	return await vscode.workspace.openTextDocument({ content: "\n\n\n" })
		.then(async doc => {
			let editor = await vscode.window.showTextDocument(doc)
				.then(editor => {
					editor.selections = selections;
					return Promise.resolve(editor);
				});

			let selects = await addToSelects(editor, options);

			let numbers = selects.sort((a, b) => a.start.line - b.start.line)
				.map(v => {
					let end = new vscode.Position(v.end.line, v.end.character + 1);
					let range = new vscode.Range(v.start, end);
					return editor.document.getText(range);
				});

			return Promise.resolve(numbers);
		});
}

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Unsorted', async () => {
		let values = await getValues();
		let numbers = values.map(v => Number.parseInt(v));
		assert.strictEqual(numbers.includes(1), true);
		assert.strictEqual(numbers.includes(2), true);
		assert.strictEqual(numbers.includes(3), true);
		numbers.forEach((v, i) => assert.notStrictEqual(v, i + 1));
		return Promise.resolve();
	});

	test('Sorted ascending', async () => {
		let values = await getValues({ sorted: true });
		let numbers = values.map(v => Number.parseInt(v));
		numbers.forEach((v, i) => assert.strictEqual(v, i + 1));
		return Promise.resolve();
	});

	test('Sorted descending', async () => {
		let values = await getValues({ sorted: true, ascending: false });
		let numbers = values.map(v => Number.parseInt(v));
		numbers.forEach((v, i) => assert.strictEqual(v, numbers.length - i));
		return Promise.resolve();
	});

	test('Insert string', async () => {
		const str = 's';
		let values = await getValues({ insertString: str });
		values.forEach(v => assert.strictEqual(v, str));
		return Promise.resolve();
	});
});
