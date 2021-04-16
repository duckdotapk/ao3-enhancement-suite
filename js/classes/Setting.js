class Setting
{
	//static instances = [];
	//static instancesById = {};

	//static categories = new Map();

	static async getAll()
	{
		let settings = (await browser.storage.local.get("settings"))?.settings;
		if(settings == undefined)
			settings = {};

		for(let setting of Setting.instances)
			if(settings[setting.id] == undefined)
				settings[setting.id] = setting.defaultValue;
			
		return settings;
	}

	static async get(id)
	{
		let settings = (await browser.storage.local.get("settings"))?.settings;
		if(settings == undefined)
			settings = {};

		let setting = settings[id];

		if(setting == undefined)
			setting = Setting.instancesById[id].defaultValue;

		return setting;
	}

	static async set(id, value)
	{
		let settings = await Setting.getAll();

		settings[id] = value;

		await browser.storage.local.set({ settings: settings });
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

// HACK: This is working around an issue where static fields cause validation to fail on Mozilla.
//			https://github.com/mozilla/addons-linter/issues/3673
//			https://github.com/mozilla/addons-linter/issues/3062#issuecomment-714170622

Setting.instances = [];
Setting.instancesById = {};
Setting.categories = new Map();