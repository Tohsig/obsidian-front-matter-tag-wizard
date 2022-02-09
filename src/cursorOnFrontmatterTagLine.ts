import { EditorPosition, SectionCache, Editor, CachedMetadata } from "obsidian";

/**
 * TODO: This approach is inconsistent. Obsidian appears to update the section
 * position on a regular tick, so if you're in multiline mode and jam enter
 * fast enough this function will incorrectly return false.
 */
function isCursorInFrontMatter(
	cursor: EditorPosition,
	cache: CachedMetadata,
	editor: Editor
) {
	const head = cache.sections?.first();
	if (!head) return false;
	if (head.type !== "yaml") return false;

	const line = editor.getLine(cursor.line);
	if (line === "---") return false;
	if (cursor.line > head.position.end.line + 1) return false;

	return true;
}

function getPreviousYamlKey(
	editor: Editor,
	curLine: number
): string | undefined {
	const line = editor.getLine(curLine);
	if (line.includes(":")) {
		const [key] = line.split(":");
		return `${key}:`;
	} else if (curLine > 1) {
		return getPreviousYamlKey(editor, curLine - 1);
	} else {
		return undefined;
	}
}

const matchTagsKey = /tags:\s|tag:\s/i;
function isCursorOnTagLine(cursor: EditorPosition, editor: Editor) {
	let test: string;

	const line = editor.getLine(cursor.line);
	if (line.trim() === "---") return false;

	if (line.includes(":")) {
		test = line;
	} else if (line.match(/^\s*-\s*/)) {
		test = getPreviousYamlKey(editor, cursor.line) + " ";
	}

	if (test) {
		return test.match(matchTagsKey) !== null;
	} else {
		return false;
	}
}

export function cursorOnFrontMatterTagLine(
	cache: CachedMetadata,
	cursor: EditorPosition,
	editor: Editor
): boolean {
	if (!isCursorInFrontMatter(cursor, cache, editor)) {
		return false;
	}

	if (!isCursorOnTagLine(cursor, editor)) {
		return false;
	}

	return true;
}
