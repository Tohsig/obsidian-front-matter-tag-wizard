export function yamlFormatTags(text: string): string {
	const [head, ...tail] = text.match(/[^:\s,]+/g);
	const tags = Array.from(new Set(tail));
	return `${head}: ${tags.join(", ")} `;
}
