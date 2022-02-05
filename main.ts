import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	Plugin,
	TFile,
	getAllTags,
	App,
	CachedMetadata,
	SectionCache,
} from "obsidian";

function getTagSet(app: App) {
	const tags = new Set<string>();
	const files = app.vault.getMarkdownFiles();
	const cache = app.metadataCache;

	const a = performance.now();
	let testCache: CachedMetadata;
	for (const file of files) {
		let fileCache = cache.getFileCache(file);
		testCache = fileCache;
		if (fileCache) {
			getAllTags(fileCache)?.forEach((t) => tags.add(t));
		}
	}
	const b = performance.now();
	console.info(`tags indexed in ${(b - a).toPrecision(2)}ms`);

	return tags;
}

export default class FrontmatterTagWizardPlugin extends Plugin {
	onload() {
		console.log("registering", this.app);
		this.registerEditorSuggest(new TagWizard(this.app));
	}
}

class TagWizard extends EditorSuggest<string> {
	private app: App;
	private tags: Set<string>;
	private tagHeadRegex = /tags:|tag:/i;
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
		if (!this.isValidLine(cursor, editor, file)) return null;
		this.tags = getTagSet(this.app);

		const line = editor.getLine(cursor.line).slice(0, cursor.ch);
		const matched = line.match(this.matchLast);

		if (matched !== null) {
			const matchData = {
				start: {
					ch: matched.index,
					line: cursor.line,
				},
				end: cursor,
				query: matched[0].toLowerCase(),
			};

			return matchData;
		}

		return null;
	}

	/* --------------------------- Line Determination --------------------------- */
	isValidLine(cursor: EditorPosition, editor: Editor, file: TFile) {
		const cache = this.app.metadataCache.getFileCache(file);

		if (!this.isCursorInFrontmatter(cursor, cache.sections[0])) {
			return false;
		}

		if (!this.isCursorOnTagLine(cursor, editor)) {
			return false;
		}

		return true;
	}

	isCursorInFrontmatter(cursor: EditorPosition, section: SectionCache) {
		if (section.type !== "yaml") {
			return false;
		}
		if (cursor.line >= section.position.end.line) {
			return false;
		}
		return true;
	}

	isCursorOnTagLine(cursor: EditorPosition, editor: Editor) {
		const line = editor.getLine(cursor.line);
		if (line.match(this.tagHeadRegex) !== null) return true;
	}

	/* -------------------------------- Obsidian -------------------------------- */
	getSuggestions(context: EditorSuggestContext): string[] {
		const suggestions = Array.from(this.tags.values()).filter((t) =>
			t.toLowerCase().contains(context.query)
		);
		return suggestions;
	}

	renderSuggestion(suggestion: string, el: HTMLElement): void {
		const outer = el.createDiv({ cls: "ES-suggester-container" });
		outer.createDiv({ cls: "ES-tags" }).setText(`${suggestion}`);
	}

	selectSuggestion(suggestion: string): void {
		if (this.context) {
			(this.context.editor as Editor).replaceRange(
				`${suggestion}`,
				this.context.start,
				this.context.end
			);
		}
	}
}
