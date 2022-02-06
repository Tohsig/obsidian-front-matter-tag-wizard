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
import { isFrontmatterTagLine } from "./isFrontmatterTagLine";
import { formatFrontmatterTags } from "./formatFrontmatterTags";

const matchLastTag = /[\w-]+$/;

export class TagWizardSuggest extends EditorSuggest<string> {
	private app: App;
	private tags: Set<string>;
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
		const cache = this.app.metadataCache.getFileCache(file);
		if (!isFrontmatterTagLine(cache, cursor, editor)) {
			if (this.queueFormatTagValues) {
				formatFrontmatterTags(editor, this.tagLineStart);
				this.queueFormatTagValues = false;
			}
			return null;
		}

		this.queueFormatTagValues = true;
		this.tagLineStart = cursor.line;
		this.updateTags();

		const line = editor.getLine(cursor.line).slice(0, cursor.ch);
		const matched = line.match(matchLastTag);

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
		this.tags = extractTagsFromFileCaches(cache, files);
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

			formatFrontmatterTags(this.context.editor, this.context.start.line);
		}
	}
}
