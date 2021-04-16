function createSettingLabel(settingContainer, setting, appendColon)
{
	let label = document.createElement("label");

	label.setAttribute("for", setting.id);
	label.innerText = setting.title + (appendColon ? ": " : "");

	settingContainer.appendChild(label);
}

async function createSettingInput(settingContainer, setting, userSettings, changeCallback)
{
	let input = document.createElement("input");

	input.type = setting.type;
	input.id = setting.id;

	let settingValue = await Setting.get(setting.id);
	console.log(setting.id, settingValue);

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
		Setting.set(setting.id, changeCallback(event));
	});

	settingContainer.appendChild(input);
}

async function createCheckboxSetting(settingContainer, setting, userSettings)
{
	await createSettingInput(settingContainer, setting, userSettings, function(event)
	{
		return event.target.checked;
	});

	createSettingLabel(settingContainer, setting, false);
}

async function createNumberSetting(settingContainer, setting, userSettings)
{
	createSettingLabel(settingContainer, setting, true);

	await createSettingInput(settingContainer, setting, userSettings, function(event)
	{
		return event.target.value;
	});
}

async function createSelectSetting(settingContainer, setting, userSettings)
{
	createSettingLabel(settingContainer, setting, true);

	let selectElement = document.createElement("select");
	settingContainer.appendChild(selectElement);

	for(let option of setting.extraData.options)
	{
		let optionElement = document.createElement("option");
		optionElement.setAttribute("value", option.value);
		optionElement.innerText = option.text;

		if(option.value == await Setting.get(setting.id))
			optionElement.selected = true;

		selectElement.appendChild(optionElement);
	}

	selectElement.addEventListener("change", function(event)
	{
		Setting.set(setting.id, event.target.value);
	});
}

document.addEventListener("DOMContentLoaded", async function()
{
	const userSettings = await Setting.getAll();

	const settingsContainer = document.getElementById("settings");

	for(let [categoryId, settings] of Setting.categories.entries())
	{
		let header = document.createElement("h3");
		header.innerText = categoryId;

		settingsContainer.appendChild(header);

		for(let setting of settings)
		{
			const settingContainer = document.createElement("div");
			settingContainer.classList.add("setting");

			switch(setting.type)
			{
				case "checkbox":
					await createCheckboxSetting(settingContainer, setting, userSettings);
					break;

				case "number":
					await createNumberSetting(settingContainer, setting, userSettings);
					break;

				case "select":
					await createSelectSetting(settingContainer, setting, userSettings);
					break;

				default:
					break;
			}

			settingsContainer.appendChild(settingContainer);
		}

	};
});