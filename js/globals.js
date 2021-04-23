//
// Variables
//

const ArchiveConfig =
{
	// https://github.com/otwcode/otwarchive/blob/7e583009b59acb17e805cb228c545aec6893627c/config/config.yml#L89
	COMMENT_MAX: 10000,

	// https://github.com/otwcode/otwarchive/blob/7e583009b59acb17e805cb228c545aec6893627c/config/config.yml#L473
	CHARACTER_COUNT_SCRIPTS: ["Han", "Hiragana", "Katakana", "Thai"],
}

const archiveWarnings =
[
	"Choose Not To Use Archive Warnings",
	"Graphic Depictions Of Violence",
	"Major Character Death",
	"No Archive Warnings Apply",
	"Rape/Non-Con",
	"Underage",
];

const pagePath = new URL(window.location).pathname.split("/");
pagePath.shift();

const tagLists =
[
	"ul.tags.commas",
	"dd.fandom.tags > ul",
	"dd.relationship.tags > ul",
	"dd.character.tags > ul",
	"dd.freeform.tags > ul",
];

const tagListsStr = tagLists.join(", ");

const validConfiguationKeys =
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

// TODO: shift everything towards being in this one object
const globals = {};

globals.tagListsSelector = tagListsStr;

//
// Function Calls
//

const aesDropdown = new NavDropdown(browser.i18n.getMessage("name"));

SavedComment.migrate();