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

aesDropdown.addItem("about", browser.i18n.getMessage("about"), function(event, item)
{
	let header = document.createElement("h1");
	header.innerText = browser.i18n.getMessage("name");

	{
		let version = document.createElement("span");
		version.classList.add("aes-small");
		version.innerText = " v" + browser.runtime.getManifest().version;
		header.appendChild(version);
	}

	let paragraph = document.createElement("p");
	paragraph.innerText = browser.i18n.getMessage("description");

	Modal.show(
	[
		header,
		paragraph,
	]);
});