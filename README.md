# Obsidian Front Matter Tag Wizard

Tired of having to type `#` to get tag autocompletion in your [Obsidian](https://obsidian.md/) note front matter? I feel your pain. This plugin enables tag autocompletion in your front matter...and beautifully formats those same tags to boot!

![](single-line-demo.gif)

## Features

- Enables Tag autocompletion in front matter.
- Fully supports multiline tags!
- Optional Tag Autoformatting (default: `enabled`).
  - Only affects front matter tags.
  - Standardizes tag spacing
  - Removes duplicate tags.
  - Indents mutliline tags
  - Can seamlessly convert single line tags to multiline tags and vice versa.
  - Optional removal of the `#` and `"` characters from tags (default: `enabled`).

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

This plugin has not yet been submitted to Obsidian for review, but in the meantime it can be installed for testing via the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin. Once that plugin is installed, you can go to its settings page, click "Add Beta plugin" and enter the following URL:
```
https://github.com/Tohsig/obsidian-front-matter-tag-wizard
```

Once installed and enabled, Front matter Tag Wizard will immediately start giving you tag autocompletion and autoformatting. If you only want the autocompletion, you can go to the Front matter Tag Wizard settings and turn off the autoformatting completely.

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap

- [ ] Add an option to sort front matter tags alphabetically.
- [ ] Allow autoformatter to edit background notes.
- [ ] Get some saner YAML parsing in here.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Feel free to submit issues for bug reports and additional features! This is a project I spun up to support my daily workflow, so I'll be very interested to hear how it does elsewhre.

<p align="right">(<a href="#top">back to top</a>)</p>

## Known Issues

I wrote the first version of this plugin over a weekend, so it has some goofy edge cases. This plugin is designed to support my daily workflow...so these will definitely get fixed.

### The...did it work?
If you type out a tag without using the autocomplete suggestion and then immediately click on another note, the autoformatter may not run.

**Workaround**

Always use the suggestion pop up, or always move the cursor off of the front matter tags before switching notes. Either will trigger the formatting.

### The Speed Demon
If you're using multiline mode, your `tags:` key is at the bottom of your front matter, and you hit `enter` quickly...there's a chance that the autoformatter will kick in and remove all of empty lines (including your cursor line).

**Workaround**

I guess this is a borderline feature. I have a partial workaround in the code already, so you may never see this one.

### The Dine and Dash
If you're using multiline mode *and* you have tags that start with one or more dashes (e.g. `-sampleTag`), the first dash will be removed in a very specific situation. Dashes in between tag words are not affected (e.g. `sample-tag`).

**Workaround**

This bug is due to how I'm handling YAML at the moment. Workaround is in the example below.

```yaml
# If you type:
tags:
-sampleTag

# You'll get:
tags:
  - sampleTag

# Workaround is to always have a leading dash:
tags:
- -sampleTag

# Then you'll get:
tags:
  - -sampleTag
```

<p align="right">(<a href="#top">back to top</a>)</p>

## License 

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Acknowledgments

Huge thanks to the incredible [Obsidian Dataview](https://github.com/blacksmithgu/obsidian-dataview) and [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/) projects. I was able to learn a ton about Obsidian's API from both, and I highly recommend them if you want to develop a plugin.

<p align="right">(<a href="#top">back to top</a>)</p>
