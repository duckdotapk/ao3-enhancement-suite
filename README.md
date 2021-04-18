# AO3 Enhancement Suite
This is a browser extension that aims to improve upon the already great experience on [Archive of Our Own](https://archiveofourown.org) by adding various additional features and niceties.

It is designed to be lightweight (no libraries!) and follow AO3's frontend design language.

# Installation
This extension is now available from the [Chrome Web Store](https://chrome.google.com/webstore/detail/ao3-enhancement-suite/bhmneclegcomgehhnoielpcmgjbamblj) and the [Firefox Add-on Store](https://addons.mozilla.org/en-US/firefox/addon/ao3-enhancement-suite/).

This Chrome version of this extension also works in Edge providing that you enable "Allow extensions from other stores."

# Features
## Enhanced Comment Box
There are various features to enhance the commenting experience!

### Autosaving Comments
This feature autosaves comments to your browser's storage as you type to save you time and potential headaches from browser crashes or accidentally closing tabs.

### Floating Comment Box
This feature moves the comment box into a floating, resizable window that follows you as you scroll. This makes it easy to comment as you go on long works!

*This feature must be enabled in the extension's settings before it can be used.*

### Insert Selection
This feature allows you to easily insert the text you have selected into the comment box. You can also choose the default formatting of the inserted text (bold, italics or none).

## Search Presets
This feature allows you to easily save and reload search setting presets. If you ever have a really fine tuned search to find works you're looking for and want to save it, this is the feature for you!

It can be used via the panel added to the top of the [Work Search](https://archiveofourown.org/works/search) page.

## Tag Collapse
This feature collapses excessive tags into a button by default. This allows you to browse without worrying about your screen being cluttered by works with many tags.

You can also customise the threshold allowed before tags are collapsed.

## Work Stats
### Average words per chapter
This feature adds an "Average words per chapter" stat to multi-chapter works so you can easily get an idea of how long it might take to read through each chapter of a longer work.

### Estimated reading time
This feature adds an "Estimated reading time" stat to works so you can get a more specific idea of how long it may take to read a work. 

You can customise the words-per-minute used to calculate this statistic in the extension's settings to your own personal reading speed.

# Screenshots
Here are some screenshots of the features in action:

![Search Presets](https://addons.cdn.mozilla.net/user-media/previews/full/255/255054.png?modified=1618636155)

![Floating Comment Box](https://addons.cdn.mozilla.net/user-media/previews/full/255/255247.png?modified=1618636160)

# Developing
Clone/fork this repository and load the addon into your web browser. There are no additional setup steps.

# License

See [LICENSE](/LICENSE).

# Version History
## 1.2

**This update was released on April 16th, 2021.**

- Updated the design of the settings page.
	- Added tooltips to every setting that explain what they do.
	- Added buttons at the bottom to reset your settings and to reset all data.
- Added various new comment box features.
	- Autosaving comments to your browser's storage.
	- A floating comment box with customisable opacity, disabled by default.
	- The ability to hide the "Comment as <pseud>" heading and "Plain text with limited HTML" footnote, disabled by default.
	- An "Insert Selection" button with customisable formatting.

## 1.1.2

**This update was released on April 13th, 2021.**

- Various internal code changes to resolve warnings from and work around Mozilla's linter.
- Added new 16x16 and 32x32 icons for the browser action instead of using the 48x48 icon for this.

## 1.1.1

**This update was released on April 13th, 2021.**

Fixed a few bugs that caused settings to be completely broken for new installs (everyone but me).

## 1.1

**This update was released on April 12th, 2021.**

- Updated the icon slightly and added a higher resolution version.
- Added settings to customise your experience.
	- These can be accessed from your browser's extensions panel or via the new AES browser action button.
- Added a new Tag Collapse feature.
	- This makes browsing through works with lots and lots of tags much more manageable.
	- Tags can be expanded via the "And X more tags" button at the end of a tag list.
	- You can also hide tags altogether by setting the threshold to 0, putting them behind a "Show X tags" button instead.
- Added a new Estimated reading time stat for works.
- Added support for localization of most text strings.
	- This will require other people to contribute to the project though as I only know English.

## 1.0
Initial release on April 10th, 2021.