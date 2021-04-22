(function()
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

	async function createSettingsContainer()
	{
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

					if(setting.experimental)
						tooltip += "\r\n\r\n" + browser.i18n.getMessage("setting_is_experimental");

					if(setting.requiresReload)
						tooltip += "\r\n\r\n" + browser.i18n.getMessage("setting_requires_reload");
	
					settingContainer.setAttribute("title", tooltip);
				}
	
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

				if(setting.experimental)
				{
					const span = document.createElement("span");
					span.innerText = "(" + browser.i18n.getMessage("experimental") + ")";

					settingContainer.appendChild(span);
				}
	
				settingsList.appendChild(settingContainer);
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

		return settingsContainer;
	}
	
	aesDropdown.addItem("settings", browser.i18n.getMessage("settings"), async function(event, item)
	{
		const settingsContainer = await createSettingsContainer();

		Modal.show(
		[
			settingsContainer,
		]);
	});
})();