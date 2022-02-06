import {
	FrontmatterTagWizardPlugin,
	FrontmatterTagWizardPluginSettings,
} from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class FrontmatterTagWizardPluginSettingsTab extends PluginSettingTab {
	plugin: FrontmatterTagWizardPlugin;

	constructor(app: App, plugin: FrontmatterTagWizardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();

		this.containerEl.createEl("h3", {
			text: "Frontmatter Tag Wizard Settings",
		});
		new Setting(containerEl)
			.setName("Enable Tag Autoformatting")
			.setDesc(
				"If enabled, this plugin will also format your tags automatically when you move the cursor outside of the tag list, or when you select an autocomplete suggestion."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoFormat)
					.onChange(async (value) => {
						this.plugin.settings.autoFormat = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Tag Autoformatting Mode")
			.setDesc(
				"If Autoformat is enabled, you can choose to put all of your frontmatter tags on a single line, or have a line per tag."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("singleLine", "Single Line")
					.addOption("multiLine", "Line per Tag")
					.setValue(this.plugin.settings.mode)
					.onChange(async (value) => {
						this.plugin.settings.mode =
							value as FrontmatterTagWizardPluginSettings["mode"];
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Remove Extra Characters")
			.setDesc(
				"If enabled, this will remove quotation marks and the # prefix from your frontmatter tags when autoformatting."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.removeExtraCharacters)
					.onChange(async (value) => {
						this.plugin.settings.removeExtraCharacters = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
