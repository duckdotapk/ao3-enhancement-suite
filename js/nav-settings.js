(async function()
{
	//
	// Util Functions
	//

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

	function addFooterLink(footer, id, text, tooltip, onClick)
	{
		const link = document.createElement("a");
		link.id = id;
		link.setAttribute("href", "#");
		link.setAttribute("title", tooltip);
		link.innerText = text;
	
		link.addEventListener("click", function(event)
		{
			event.preventDefault();
	
			onClick(event);
		});
	
		footer.appendChild(link);
	}

	function addFooterSeparator(footer)
	{
		let separator = document.createElement("span");
		separator.innerText = " · ";
		footer.appendChild(separator);
	}

	//
	// Settings Container
	//

	const settingsContainer = document.createElement("div");
	settingsContainer.id = "aes-settings";

	let settingsHeader = document.createElement("h1");
	settingsHeader.innerText = browser.i18n.getMessage("settings");
	settingsContainer.appendChild(settingsHeader);

	for(let [categoryId, settings] of Setting.categories.entries())
	{
		let categoryContainer = document.createElement("fieldset");
		settingsContainer.append(categoryContainer);

		let categoryHeader = document.createElement("h4");
		categoryHeader.classList.add("heading");
		categoryHeader.innerText = categoryId;
		categoryContainer.appendChild(categoryHeader);

		let settingsList = document.createElement("ul");
		categoryContainer.appendChild(settingsList);

		for(let setting of settings)
		{
			const settingContainer = document.createElement("li");
			settingsContainer.classList.add("aes-setting");
			settingsContainer.classList.add("aes-setting-" + setting.type);

			if(setting.tooltip)
			{
				let tooltip = setting.tooltip;
				if(setting.requiresReload)
					tooltip += "\r\n\r\n" + browser.i18n.getMessage("setting_requires_reload");

				settingContainer.setAttribute("title", tooltip);
			}

			settingsList.appendChild(settingContainer);

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

	// TODO: Replace this with a controlSet now that it's part of the page
	let footer = document.createElement("footer");
	settingsContainer.appendChild(footer);

	addFooterLink(footer, "reset-settings", browser.i18n.getMessage("reset_all_settings"), browser.i18n.getMessage("reset_all_settings_tooltip"), async function(event)
	{
		await browser.storage.local.remove("settings");

		location.reload();
	});

	addFooterSeparator(footer);

	addFooterLink(footer, "reset-data", browser.i18n.getMessage("reset_all_data"), browser.i18n.getMessage("reset_all_data_tooltip"), async function(event)
	{
		// TODO: switch to Modal.confirm
		if(window.confirm(browser.i18n.getMessage("reset_all_data_confirmation")))
		{
			await browser.storage.local.clear();

			location.reload();
		}
	});
	
	aesDropdown.addItem(browser.i18n.getMessage("settings"), function(event, item)
	{
		Modal.show(
		[
			settingsContainer,
		]);
	});
})();