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