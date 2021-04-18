document.addEventListener("DOMContentLoaded", async function()
{
	const settingsContainer = document.getElementById("settings");

	let header = document.createElement("h1");
	header.id = "header";
	header.innerText = browser.i18n.getMessage("name");
	settingsContainer.appendChild(header);

	let settingsMoved = document.createElement("p");
	settingsMoved.innerText = browser.i18n.getMessage("settings_moved", [ browser.i18n.getMessage("name") ]);
	settingsContainer.appendChild(settingsMoved);
});