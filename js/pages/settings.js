function createSettingLabel(settingContainer, setting, appendColon)
{
	let label = document.createElement("label");

	label.setAttribute("for", setting.id);
	label.innerHTML = setting.title + (appendColon ? ": " : "");

	settingContainer.appendChild(label);
}

function createSettingInput(settingContainer, setting, userSettings, changeCallback)
{
	let input = document.createElement("input");

	input.type = setting.type;
	input.id = setting.id;

	let settingValue = userSettings[setting.id] != undefined ? userSettings[setting.id] : setting.defaultValue;
	switch(setting.type)
	{
		case "checkbox":
			input.checked = settingValue;
			break;
		
		case "number":
			input.value = settingValue;
			
			if(setting.extraData)
			{
				if(setting.extraData.min != undefined)
					input.setAttribute("min", setting.extraData.min);

				if(setting.extraData.max != undefined)
					input.setAttribute("max", setting.extraData.max);
			}

			break;

		default:
			break;
	}

	input.addEventListener("change", function(event)
	{
		let storage =
		{
			settings: userSettings,
		}
		
		storage.settings[setting.id] = changeCallback(event);

		browser.storage.local.set(storage);
	});

	settingContainer.appendChild(input);
}

function createCheckboxSetting(settingContainer, setting, userSettings)
{
	createSettingInput(settingContainer, setting, userSettings, function(event)
	{
		return event.target.checked;
	});

	createSettingLabel(settingContainer, setting, false);
}

function createNumberSetting(settingContainer, setting, userSettings)
{
	createSettingLabel(settingContainer, setting, true);

	createSettingInput(settingContainer, setting, userSettings, function(event)
	{
		return event.target.value;
	});
}

document.addEventListener("DOMContentLoaded", async function()
{
	const userSettings = (await browser.storage.local.get("settings")).settings;

	const settingsContainer = document.getElementById("settings");

	Setting.categories.forEach(function(settings, categoryId, map)
	{

		let header = document.createElement("h3");
		header.innerHTML = categoryId;

		settingsContainer.appendChild(header);

		for(let setting of settings)
		{
			const settingContainer = document.createElement("div");

			switch(setting.type)
			{
				case "checkbox":
					createCheckboxSetting(settingContainer, setting, userSettings);
					break;

				case "number":
					createNumberSetting(settingContainer, setting, userSettings);
					break;

				default:
					break;
			}

			settingsContainer.appendChild(settingContainer);
		}

	});
});