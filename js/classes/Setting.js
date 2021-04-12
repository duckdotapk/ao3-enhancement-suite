class Setting
{
	static instances = [];
	static instancesById = {};

	static categories = new Map();

	static async getAll()
	{
		let settings = (await browser.storage.local.get("settings")).settings;

		for(let setting of Setting.instances)
			if(settings[setting.id] == undefined)
				settings[setting.id] = setting.defaultValue;
			
		return settings;
	}

	static async get(id)
	{
		let settings = (await browser.storage.local.get("settings")).settings;

		let setting = settings[id];

		if(setting == undefined)
			setting = Setting.instancesById[id].defaultValue;

		return setting;
	}

	constructor(id, categoryId, title, type, defaultValue, extraData)
	{
		this.id = id;
		this.categoryId = categoryId;
		this.title = title;
		this.type = type;
		this.defaultValue = defaultValue;
		this.extraData = extraData;

		Setting.instances.push(this);
		Setting.instancesById[id] = this;

		let category = Setting.categories.get(categoryId);
		if(category == undefined)
			category = [];

		category.push(this);

		Setting.categories.set(categoryId, category);
	}
}