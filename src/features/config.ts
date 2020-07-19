import * as vscode from 'vscode';

export class Config {
	private config = vscode.workspace.getConfiguration('selects');
	private keyOrDefault = <T>(name: string) => this.config.get<T>(name) ?? "";

	get incrementTrailing(): string {
		return this.keyOrDefault('increment.trailing');
	}

	get insertTrailing(): string {
		return this.keyOrDefault('insert.trailing');
	}
}