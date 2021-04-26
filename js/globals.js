//
// Variables
//

const globals = {};

globals.ArchiveConfig =
{
	// https://github.com/otwcode/otwarchive/blob/7e583009b59acb17e805cb228c545aec6893627c/config/config.yml#L89
	COMMENT_MAX: 10000,

	// https://github.com/otwcode/otwarchive/blob/7e583009b59acb17e805cb228c545aec6893627c/config/config.yml#L473
	CHARACTER_COUNT_SCRIPTS: ["Han", "Hiragana", "Katakana", "Thai"],
}

globals.archiveWarnings =
[
	"Choose Not To Use Archive Warnings",
	"Graphic Depictions Of Violence",
	"Major Character Death",
	"No Archive Warnings Apply",
	"Rape/Non-Con",
	"Underage",
];

globals.managers = {};

globals.managers.savedCommentManager = new UserDataManager("savedComments");
globals.managers.searchPresetManager = new UserDataManager("searchPresets");

globals.pagePath = new URL(window.location).pathname.split("/");
globals.pagePath.shift();

globals.tagListsSelectors =
[
	"ul.tags.commas",
	"dd.fandom.tags > ul",
	"dd.relationship.tags > ul",
	"dd.character.tags > ul",
	"dd.freeform.tags > ul",
];

globals.tagListsSelector = globals.tagListsSelectors.join(", ");

globals.validConfiguationKeys =
[
	"hidelistAuthors",
	"hidelistFandoms",
	"hidelistWarnings",
	"hidelistRelationships",
	"hidelistCharacters",
	"hidelistFreeforms",
	"savedComments",
	"searchPresets",
	"settings",
];

//
// Function Calls
//

const aesDropdown = new NavDropdown(browser.i18n.getMessage("name"));