class Feature
{
	constructor(id, onInit, onSettingChange)
	{
		this.id = id;
		this.onInit = onInit;
		this.onSettingChange = onSettingChange;

		Feature.instances.push(this);
	}

	async execute(settings)
	{
		try
		{
			await this.onInit(settings);	
		}
		catch(error)
		{
			console.log(`Error occured while executing code for the "${ this.id }" feature:`);
			console.log(error);
			debugger;
		}
	}
}

Feature.instances = [];

browser.storage.onChanged.addListener(function(changes, areaName)
{
	if(areaName == "local")
	{
		if(changes.settings != undefined)
		{
			let oldSettings = changes.settings.oldValue != undefined ? changes.settings.oldValue : Setting.defaultValues;
			let newSettings = changes.settings.newValue != undefined ? changes.settings.newValue : Setting.defaultValues;

			const changedSettings = {};
			for(let setting of Setting.instances)
				changedSettings[setting.id] = oldSettings[setting.id] != newSettings[setting.id];

			console.log(changedSettings);

			for(let feature of Feature.instances)
				if(feature.onSettingChange != undefined)
					feature.onSettingChange(newSettings, changedSettings);
		}

	}
});