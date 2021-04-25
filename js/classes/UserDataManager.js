class UserDataManager
{
	constructor(storageKey)
	{
		this.storageKey = storageKey;
	}

	async all()
	{
		let storage = await browser.storage.local.get(this.storageKey);

		let allUserData = storage[this.storageKey];

		if(allUserData == undefined)
			allUserData = {};

		return allUserData;
	}

	async get(id)
	{
		let allUserData = await this.all();
		
		let userData = allUserData[id];

		return userData;
	}

	async set(id, data)
	{
		let allUserData = await this.all();

		allUserData[id] = data;

		const storage = {};
		storage[this.storageKey] = allUserData;

		await browser.storage.local.set(storage);
	}

	async delete(id)
	{
		let allUserData = await this.all();
		
		delete allUserData[id];

		const storage = {};
		storage[this.storageKey] = allUserData;

		await browser.storage.local.set(storage);
	}

	async reset()
	{
		const storage = {};
		storage[this.storageKey] = {};

		await browser.storage.local.set(storage);
	}
}