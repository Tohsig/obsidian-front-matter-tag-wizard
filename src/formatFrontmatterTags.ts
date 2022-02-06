import { Editor } from "obsidian";

export function formatFrontmatterTags(editor: Editor, lineNumber: number) {
	console.log("formatting line", lineNumber);
	const line = editor.getLine(lineNumber);
	const [head, ...tail] = line.match(/[^:\s,]+/g);
	const tags = Array.from(new Set(tail));
	editor.setLine(lineNumber, `${head}: ${tags.join(", ")} `);
}
