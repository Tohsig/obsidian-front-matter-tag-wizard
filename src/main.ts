import { Plugin } from "obsidian";
import { TagWizardSuggest } from "./tagWizardSuggest";
import { FrontMatterTagWizardPluginSettingsTab } from "./userSettings";

export interface FrontMatterTagWizardPluginSettings {
	mode: "singleLine" | "multiLine";
	autoFormat: boolean;
	removeExtraCharacters: boolean;
}

const DEFAULT_SETTINGS: FrontMatterTagWizardPluginSettings = {
	mode: "singleLine",
	autoFormat: true,
	removeExtraCharacters: true,
};

export class FrontMatterTagWizardPlugin extends Plugin {
	settings: FrontMatterTagWizardPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(
			new FrontMatterTagWizardPluginSettingsTab(this.app, this)
		);
		this.registerEditorSuggest(
			new TagWizardSuggest(this.app, this.settings)
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export default FrontMatterTagWizardPlugin;
