import { getAllTags, MetadataCache, TFile } from "obsidian";

export function extractTagsFromFileCaches(
	metadataCache: MetadataCache,
	files: TFile[]
): Set<string> {
	const tags = new Set<string>();

	// const a = performance.now();
	for (const file of files) {
		let fileCache = metadataCache.getFileCache(file);
		if (fileCache) {
			getAllTags(fileCache)?.forEach((t) => {
				const tag = t.replace("#", "");
				tags.add(tag);
			});
		}
	}
	// const b = performance.now();
	// console.info(`tags extraced in ${(b - a).toPrecision(2)}ms`);

	return tags;
}
