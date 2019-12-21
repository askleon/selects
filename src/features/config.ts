import * as vscode from 'vscode';

interface Config {
	trailing: string;
}

export class Configuration implements Config {
	get trailing(): string {
		return this.config.get('trailing') ?? "";
	}

	private get config() {
		return vscode.workspace.getConfiguration('selects');
	}
}