import { EditorPosition, SectionCache, Editor, CachedMetadata } from "obsidian";

/**
 * TODO: This approach is inconsistent. Obsidian appears to update the section
 * position on a regular tick, so if you're in multiline mode and jam enter
 * fast enough this function will incorrectly return false.
 */
function isCursorInFrontmatter(cursor: EditorPosition, section: SectionCache) {
	if (section.type !== "yaml") return false;
	if (cursor.line > section.position.end.line + 1) return false;
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

const matchTagsKey = /tags:|tag:/i;
function isCursorOnTagLine(cursor: EditorPosition, editor: Editor) {
	let test: string;

	const line = editor.getLine(cursor.line);

	if (line.includes(":")) {
		test = line;
	} else {
		test = getPreviousYamlKey(editor, cursor.line);
	}
	if (test) {
		return test.match(matchTagsKey) !== null;
	} else {
		return false;
	}
}

export function cursorOnFrontmatterTagLine(
	cache: CachedMetadata,
	cursor: EditorPosition,
	editor: Editor
): boolean {
	if (!isCursorInFrontmatter(cursor, cache.sections[0])) {
		return false;
	}

	if (!isCursorOnTagLine(cursor, editor)) {
		return false;
	}

	return true;
}
