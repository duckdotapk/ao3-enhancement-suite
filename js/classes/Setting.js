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

	constructor(options)
	{
		this.id = options.id;
		this.categoryId = options.category;
		this.title = options.title;
		this.type = options.type;
		this.defaultValue = options.defaultValue;
		this.tooltip = options.tooltip;
		this.experimental = options.experimental;
		this.requiresReload = options.requiresReload;
		this.extraData = options.extraData;

		Setting.instances.push(this);
		Setting.instancesById[this.id] = this;

		let category = Setting.categories.get(this.categoryId);
		if(category == undefined)
			category = [];

		category.push(this);

		Setting.categories.set(this.categoryId, category);
	}
}

// HACK: This is working around an issue where static fields cause validation to fail on Mozilla.
//			https://github.com/mozilla/addons-linter/issues/3673
//			https://github.com/mozilla/addons-linter/issues/3062#issuecomment-714170622

Setting.instances = [];
Setting.instancesById = {};
Setting.categories = new Map();