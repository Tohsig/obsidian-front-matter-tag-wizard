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
import { cursorOnFrontMatterTagLine } from "./cursorOnFrontMatterTagLine";
import { yamlFormatTags } from "./yamlFormatTags";
import { FrontMatterTagWizardPluginSettings } from "./main";

const matchLastTag = /[\w-]+\/?[\w-]+$/;

export class TagWizardSuggest extends EditorSuggest<string> {
	private app: App;
	private curFileName: string;
	private prevFileName: string;
	private queueFormatTagValues = false;
	private tagLineStart = 0;
	private settings: FrontMatterTagWizardPluginSettings;

	constructor(app: App, settings: FrontMatterTagWizardPluginSettings) {
		super(app);
		this.app = app;
		this.settings = settings;
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile
	): EditorSuggestTriggerInfo {
		this.curFileName = file.name;

		const cache = this.app.metadataCache.getFileCache(file);
		if (!cursorOnFrontMatterTagLine(cache, cursor, editor)) {
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

	formatTags(editor: Editor): void {
		if (!this.settings.autoFormat) return;

		const [startLine, endLine] = this.getTagBlockBounds(editor);
		if (!startLine || !endLine) return;

		const lines: string[] = [];
		let endCh = 0;
		for (let i = startLine; i <= endLine; i++) {
			const line = editor.getLine(i);
			lines.push(line);
			if (i === endLine) endCh = line.length;
		}

		this.queueFormatTagValues = false;
		if (this.curFileName !== this.prevFileName) return;
		const newLine = yamlFormatTags(
			lines.join("\n"),
			this.settings.mode,
			this.settings.removeExtraCharacters
		);

		editor.replaceRange(
			newLine,
			{ line: startLine, ch: 0 },
			{ line: endLine, ch: endCh }
		);
	}

	getTagBlockBounds(editor: Editor): [start: number, end: number] {
		const eof = editor.lastLine();
		let line = "";
		let i = 1;
		let start: number;
		let end: number;
		do {
			line = editor.getLine(i);

			if (line.includes("tag:") || line.includes("tags:")) {
				start = i;
			} else if (start && !end) {
				if (line.match(/^\s*-\s/) === null) {
					end = i - 1;
				}
			}

			i++;
		} while (!end || !line.includes("---"));

		if (!end) end = i - 2;

		return [start, end];
	}

	matchPartialTag(
		cursor: EditorPosition,
		editor: Editor
	): EditorSuggestTriggerInfo {
		const line = editor.getLine(cursor.line).slice(0, cursor.ch);
		const matched = line.match(matchLastTag);

		if (matched !== null) {
			const context: EditorSuggestTriggerInfo = {
				start: {
					ch: matched.index,
					line: cursor.line,
				},
				end: cursor,
				query: matched[0],
			};

			return context;
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

			this.formatTags(this.context.editor);
		}
	}
}
