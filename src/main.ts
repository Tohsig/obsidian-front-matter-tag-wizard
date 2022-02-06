import { Plugin } from "obsidian";
import { TagWizardSuggest } from "./tagWizardSuggest";

export default class FrontmatterTagWizardPlugin extends Plugin {
	onload() {
		this.registerEditorSuggest(new TagWizardSuggest(this.app));
	}
}
