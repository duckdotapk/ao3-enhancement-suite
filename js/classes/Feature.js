class Feature
{
	static async executeAll()
	{
		const settings = await Setting.getAll();

		for(let feature of Feature.instances)
		{
			let executeFeature = false;

			if(feature.filters != undefined)
			{
				for(let filter of feature.filters)
				{
					if(filter.length <= globals.pagePath.length)
					{
						for(let i = 0; i < filter.length; i++)
						{
							let filterComponent = filter[i];

							let pagePathComponent = globals.pagePath[i];
	
							// If this component is undefined, consider it a match and continue
							if(filterComponent == undefined)
								continue;

							// If these match AND it's the last one in the filter, consider this a valid page to run the feature on
							if(filterComponent == pagePathComponent)
							{
								if(i == filter.length - 1)
									executeFeature = true;
							}
							else
							{
								break;
							}
						}
					}

					if(executeFeature)
						break;
				}
			}
			else
			{
				executeFeature = true;
			}

			if(executeFeature)
				await feature.execute(settings);
			else
				console.log(`Skipped executing the "${ feature.id }" feature for this page.`);
		}
	}

	constructor(id, filters, onInit, onSettingChange)
	{
		if(id == undefined)
			debugger;

		this.id = id;
		this.filters = filters;
		this.onInit = onInit;
		this.onSettingChange = onSettingChange;

		Feature.instances.push(this);
	}

	async execute(settings)
	{

		try
		{
			await this.onInit(settings);
			console.log(`Successfully executed onInit for the "${ this.id }" feature.`);
		}
		catch(error)
		{
			console.log(`Error executing onInit for the "${ this.id }" feature`);
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

			for(let feature of Feature.instances)
			{
				if(feature.onSettingChange != undefined)
				{
					try
					{
						feature.onSettingChange(newSettings, changedSettings);
					}
					catch(error)
					{
						console.log(`Error occured while executing onSettingChange for the "${ feature.id }" feature:`);
						console.log(error);
						debugger;
					}
				}
			}
		}
	}
});