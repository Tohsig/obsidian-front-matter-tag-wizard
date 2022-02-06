import { EditorPosition, SectionCache, Editor, CachedMetadata } from "obsidian";

const matchTagsKey = /tags:|tag:/i;

function isCursorInFrontmatter(cursor: EditorPosition, section: SectionCache) {
	if (section.type !== "yaml") {
		return false;
	}
	if (cursor.line >= section.position.end.line) {
		return false;
	}
	return true;
}

function isCursorOnTagLine(cursor: EditorPosition, editor: Editor) {
	const line = editor.getLine(cursor.line);
	if (line.match(matchTagsKey) !== null) return true;
}

export function isFrontmatterTagLine(
	cache: CachedMetadata,
	cursor: EditorPosition,
	editor: Editor
) {
	if (!isCursorInFrontmatter(cursor, cache.sections[0])) {
		return false;
	}

	if (!isCursorOnTagLine(cursor, editor)) {
		return false;
	}

	return true;
}
