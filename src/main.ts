import { Plugin } from "obsidian";
import { TagWizardSuggest } from "./tagWizardSuggest";

export default class FrontmatterTagWizardPlugin extends Plugin {
	onload() {
		console.log("registering", this.app);
		this.registerEditorSuggest(new TagWizardSuggest(this.app));
	}
}
