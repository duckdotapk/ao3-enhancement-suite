const archiveWarnings =
[
	"Choose Not To Use Archive Warnings",
	"Graphic Depictions Of Violence",
	"Major Character Death",
	"No Archive Warnings Apply",
	"Rape/Non-Con",
	"Underage",
];

const tagLists =
[
	"ul.tags.commas",
	"dd.fandom.tags > ul",
	"dd.relationship.tags > ul",
	"dd.character.tags > ul",
	"dd.freeform.tags > ul",
];

const tagListsStr = tagLists.join(", ");

const aesDropdown = new NavDropdown(browser.i18n.getMessage("name"));