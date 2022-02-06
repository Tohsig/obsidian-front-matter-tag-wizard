const reReplace = /^\s*-|[:\s,]+/g;
const reReplaceExtra = /^\s*-|[:\s,#"']+/g;
const reSplit = /[^:\s,]+/g;
const reSplitExtra = /[^:\s,#"']+/g;

function parseTags(text: string, removeExtraCharacters: boolean) {
	let tagSet: Set<string>;

	if (text.includes("\n")) {
		const re = removeExtraCharacters ? reReplaceExtra : reReplace;
		const [_head, ...tail] = text
			.split("\n")
			.map((t) => t.replace(re, ""))
			.filter((t) => t.length);

		tagSet = new Set(tail);
	} else {
		const re = removeExtraCharacters ? reSplitExtra : reSplit;
		const match = text.match(re);
		if (match !== null) {
			const [_head, ...tail] = match;
			tagSet = new Set(tail.filter((t) => t.length));
		} else {
			tagSet = new Set();
		}
	}

	return Array.from(tagSet);
}

function singleLine(text: string, removeExtraCharacters: boolean) {
	const tags = parseTags(text, removeExtraCharacters);
	if (!tags.length) return "tags: ";
	return `tags: ${tags.join(", ")} `;
}

function multiLine(text: string, removeExtraCharacters: boolean) {
	const tags = parseTags(text, removeExtraCharacters);
	if (!tags.length) return "tags: ";
	return `tags:\n  - ${tags.join("\n  - ")} `;
}

export function yamlFormatTags(
	text: string,
	mode: "singleLine" | "multiLine",
	removeExtraCharacters: boolean
): string {
	switch (mode) {
		case "singleLine":
			return singleLine(text, removeExtraCharacters);
		case "multiLine":
			return multiLine(text, removeExtraCharacters);
	}
}
