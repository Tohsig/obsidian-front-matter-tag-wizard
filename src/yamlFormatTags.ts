const reReplace = /[:\s,#"']+/g;
const reSplit = /[^:\s,#"']+/g;

function parseTags(text: string) {
	let tagSet: Set<string>;

	if (text.includes("\n")) {
		const [_head, ...tail] = text
			.split("\n")
			.map((t) => t.replace(reReplace, "").trim())
			.filter((t) => t.length);

		tagSet = new Set(tail);
	} else {
		const match = text.match(reSplit);
		if (match !== null) {
			const [_head, ...tail] = match;
			tagSet = new Set(tail.filter((t) => t.length));
		} else {
			tagSet = new Set();
		}
	}

	return Array.from(tagSet);
}

function singleLine(text: string) {
	const tags = parseTags(text);
	return `tags: ${tags.join(", ")} `;
}

function multiLine(text: string) {
	const tags = parseTags(text);
	return `tags:\n  - ${tags.join("\n  - ")} `;
}

export function yamlFormatTags(
	text: string,
	mode: "singleLine" | "multiLine"
): string {
	switch (mode) {
		case "singleLine":
			return singleLine(text);
		case "multiLine":
			return multiLine(text);
	}
}
