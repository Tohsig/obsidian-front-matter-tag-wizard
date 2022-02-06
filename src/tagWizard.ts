import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
	App,
} from "obsidian";
import { extractTags } from "./extractTags";
import { isValidLine } from "./isFrontmatterTagLine";

export class TagWizard extends EditorSuggest<string> {
	private app: App;
	private tags: Set<string>;
	private matchLast = /[\w-]+$/;

	constructor(app: App) {
		super(app);
		this.app = app;
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile
	): EditorSuggestTriggerInfo {
		const cache = this.app.metadataCache.getFileCache(file);
		if (!isValidLine(cache, cursor, editor)) return null;

		this.updateTags();

		const line = editor.getLine(cursor.line).slice(0, cursor.ch);
		const matched = line.match(this.matchLast);

		if (matched !== null) {
			const matchData = {
				start: {
					ch: matched.index,
					line: cursor.line,
				},
				end: cursor,
				query: matched[0],
			};

			return matchData;
		}

		return null;
	}

	updateTags() {
		const cache = this.app.metadataCache;
		const files = this.app.vault.getMarkdownFiles();
		this.tags = extractTags(cache, files);
	}

	/* -------------------------------- Obsidian -------------------------------- */
	getSuggestions(context: EditorSuggestContext): string[] {
		const tagList = Array.from(this.tags.values());
		const suggestions = tagList.filter((t) => {
			const tag = t.toLowerCase();
			const query = context.query.toLowerCase();
			return tag.contains(query);
		});

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

			const line = this.context.editor.getLine(this.context.start.line);
			const [head, ...tail] = line.match(/[^:\s,]+/g);
			const tags = Array.from(new Set(tail));
			this.context.editor.setLine(
				this.context.start.line,
				`${head}: ${tags.join(", ")} `
			);
		}
	}
}
