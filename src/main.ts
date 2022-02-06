import { Plugin } from "obsidian";
import { TagWizardSuggest } from "./tagWizardSuggest";
import { FrontmatterTagWizardPluginSettingsTab } from "./userSettings";

export interface FrontmatterTagWizardPluginSettings {
	mode: "singleLine" | "multiLine";
	autoFormat: boolean;
	removeExtraCharacters: boolean;
}

const DEFAULT_SETTINGS: FrontmatterTagWizardPluginSettings = {
	mode: "singleLine",
	autoFormat: true,
	removeExtraCharacters: true,
};

export class FrontmatterTagWizardPlugin extends Plugin {
	settings: FrontmatterTagWizardPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(
			new FrontmatterTagWizardPluginSettingsTab(this.app, this)
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

export default FrontmatterTagWizardPlugin;
