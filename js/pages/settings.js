function createSettingLabel(settingContainer, setting, appendColon)
{
	let label = document.createElement("label");

	label.setAttribute("for", setting.id);
	label.innerText = setting.title + (appendColon ? ": " : "");

	settingContainer.appendChild(label);
}

async function createSettingInput(settingContainer, setting, changeCallback)
{
	let input = document.createElement("input");

	input.type = setting.type;
	input.id = setting.id;

	let settingValue = await Setting.get(setting.id);

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

				if(setting.extraData.step != undefined)
					input.setAttribute("step", setting.extraData.step);
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

async function createCheckboxSetting(settingContainer, setting)
{
	await createSettingInput(settingContainer, setting, function(event)
	{
		return event.target.checked;
	});

	createSettingLabel(settingContainer, setting, false);
}

async function createNumberSetting(settingContainer, setting)
{
	createSettingLabel(settingContainer, setting, true);

	await createSettingInput(settingContainer, setting, function(event)
	{
		return event.target.value;
	});
}

async function createSelectSetting(settingContainer, setting)
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
	const settingsContainer = document.getElementById("settings");

	let header = document.createElement("h1");
	header.id = "header";
	header.innerText = browser.i18n.getMessage("name");
	settingsContainer.appendChild(header);

	let settingsHeader = document.createElement("h2");
	settingsHeader.innerText = browser.i18n.getMessage("settings");
	settingsContainer.appendChild(settingsHeader);

	for(let [categoryId, settings] of Setting.categories.entries())
	{
		let categoryHeader = document.createElement("h3");
		categoryHeader.innerText = categoryId;
		settingsContainer.appendChild(categoryHeader);

		for(let setting of settings)
		{
			const settingContainer = document.createElement("div");
			settingContainer.classList.add("setting");

			if(setting.tooltip)
			{
				let tooltip = setting.tooltip;
				if(setting.requiresReload)
					tooltip += "\r\n\r\n" + browser.i18n.getMessage("setting_requires_reload");

				settingContainer.setAttribute("title", tooltip);
			}

			settingsContainer.appendChild(settingContainer);

			switch(setting.type)
			{
				case "checkbox":
					await createCheckboxSetting(settingContainer, setting);
					break;

				case "number":
					await createNumberSetting(settingContainer, setting);
					break;

				case "select":
					await createSelectSetting(settingContainer, setting);
					break;

				default:
					break;
			}

		}
	};

	let footer = document.createElement("footer");
	settingsContainer.appendChild(footer);

	{
		let versionSpan = document.createElement("span");
		versionSpan.innerText = " v" + browser.runtime.getManifest().version;
		footer.appendChild(versionSpan);
	}

	{
		let separator = document.createElement("span");
		separator.innerText = " · ";
		footer.appendChild(separator);
	}

	{
		const resetSettingsButton = document.createElement("a");
		resetSettingsButton.id = "reset-settings";
		resetSettingsButton.setAttribute("href", "#");
		resetSettingsButton.setAttribute("title", browser.i18n.getMessage("reset_all_settings_tooltip"));
		resetSettingsButton.innerText = browser.i18n.getMessage("reset_all_settings");
	
		resetSettingsButton.addEventListener("click", async function(event)
		{
			event.preventDefault();
	
			await browser.storage.local.remove("settings");
	
			location.reload();
		});
	
		footer.appendChild(resetSettingsButton);
	}

	{
		let separator = document.createElement("span");
		separator.innerText = " · ";
		footer.appendChild(separator);
	}

	{
		const resetDataButton = document.createElement("a");
		resetDataButton.id = "reset-data";
		resetDataButton.setAttribute("href", "#");
		resetDataButton.setAttribute("title", browser.i18n.getMessage("reset_all_data_tooltip"));
		resetDataButton.innerText = browser.i18n.getMessage("reset_all_data");
	
		resetDataButton.addEventListener("click", async function(event)
		{
			event.preventDefault();
	
			if(window.confirm(browser.i18n.getMessage("reset_all_data_confirmation")))
			{
				await browser.storage.local.clear();
	
				location.reload();
			}
		});
	
		footer.appendChild(resetDataButton);
	}
});