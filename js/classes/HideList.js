class HideList
{
	static async get(id)
	{
		let storageId = HideList.storageBase + id;

		let storage = await browser.storage.local.get(storageId);
		
		let hideList = storage[storageId];
		if(hideList == undefined)
			hideList = [];

		return hideList;
	}

	static async add(id, item)
	{
		if(!HideList.validIds.includes(id))
			return;

		let hideList = await HideList.get(id);

		if(!hideList.includes(item))
			hideList.push(item);

		let storage = {};
		storage[HideList.storageBase + id] = hideList;

		await browser.storage.local.set(storage);
	}

	static async includes(id, item)
	{
		let hideList = await HideList.get(id);

		return hideList.includes(item);		
	}

	static async remove(id, item)
	{
		let hideList = await HideList.get(id);

		const index = hideList.indexOf(item);
		if(index > -1)
			hideList.splice(index, 1);

		let storage = {};
		storage[HideList.storageBase + id] = hideList;

		await browser.storage.local.set(storage);
	}

	static async reset(id)
	{
		let storage = {};
		storage[HideList.storageBase + id] = [];

		await browser.storage.local.set(storage);
	}
}

HideList.storageBase = "hidelist";

HideList.validIds = 
[
	"Authors", 
	"Fandoms", 
	"Warnings", 
	"Relationships", 
	"Characters", 
	"Freeforms",
];