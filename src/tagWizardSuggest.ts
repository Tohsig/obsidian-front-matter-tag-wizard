import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
	App,
} from "obsidian";
import { extractTagsFromFileCaches } from "./extractTagsFromFileCaches";
import { cursorOnFrontmatterTagLine } from "./cursorOnFrontmatterTagLine";
import { yamlFormatTags } from "./formatFrontmatterTags";

const matchLastTag = /[\w-]+$/;

export class TagWizardSuggest extends EditorSuggest<string> {
	private app: App;
	private curFileName: string;
	private prevFileName: string;
	private queueFormatTagValues = false;
	private tagLineStart = 0;

	constructor(app: App) {
		super(app);
		this.app = app;
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile
	): EditorSuggestTriggerInfo {
		this.curFileName = file.name;

		const cache = this.app.metadataCache.getFileCache(file);
		if (!cursorOnFrontmatterTagLine(cache, cursor, editor)) {
			if (this.queueFormatTagValues) this.formatTags(editor);
			return null;
		}

		this.queueFormatTagValues = true;
		this.prevFileName = file.name;
		this.tagLineStart = cursor.line;

		return this.matchPartialTag(cursor, editor);
	}

	/* ------------------------------- Manage Tags ------------------------------ */
	getTags(): string[] {
		const cache = this.app.metadataCache;
		const files = this.app.vault.getMarkdownFiles();
		const tagSet = extractTagsFromFileCaches(cache, files);
		return Array.from(tagSet.values());
	}

	formatTags(editor: Editor, lineNumber = this.tagLineStart): void {
		this.queueFormatTagValues = false;
		if (this.curFileName !== this.prevFileName) return;
		const oldLine = editor.getLine(lineNumber);
		const newLine = yamlFormatTags(oldLine);
		editor.setLine(lineNumber, newLine);
	}

	matchPartialTag(
		cursor: EditorPosition,
		editor: Editor
	): EditorSuggestTriggerInfo {
		const line = editor.getLine(cursor.line).slice(0, cursor.ch);
		const matched = line.match(matchLastTag);

		if (matched !== null) {
			return {
				start: {
					ch: matched.index,
					line: cursor.line,
				},
				end: cursor,
				query: matched[0],
			};
		}

		return null;
	}

	/* -------------------------------- Obsidian -------------------------------- */
	getSuggestions(context: EditorSuggestContext): string[] {
		const query = context.query.toLowerCase();
		const suggestions = this.getTags().filter((t) =>
			t.toLowerCase().includes(query)
		);

		return suggestions;
	}

	renderSuggestion(suggestion: string, el: HTMLElement): void {
		const outer = el.createDiv();
		outer.createDiv().setText(`#${suggestion}`);
	}

	selectSuggestion(suggestion: string): void {
		if (this.context) {
			this.context.editor.replaceRange(
				`${suggestion} `,
				this.context.start,
				this.context.end
			);

			this.formatTags(this.context.editor, this.context.start.line);
		}
	}
}
