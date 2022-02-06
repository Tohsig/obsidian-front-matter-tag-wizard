import { Plugin } from "obsidian";
import { TagWizard } from "./tagWizard";

export default class FrontmatterTagWizardPlugin extends Plugin {
	onload() {
		console.log("registering", this.app);
		this.registerEditorSuggest(new TagWizard(this.app));
	}
}
