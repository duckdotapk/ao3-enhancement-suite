class SavedComment
{
	static async getAll()
	{
		let savedComments = (await browser.storage.local.get("savedComments"))?.savedComments;
	
		if(savedComments == undefined)
			savedComments = {};

		return savedComments;
	}

	static async get(id)
	{
		let savedComments = await SavedComment.getAll();
		
		let savedComment = savedComments[id];

		return savedComment;
	}

	static async save(id, text)
	{
		let savedComments = await SavedComment.getAll();

		savedComments[id] = text;

		await browser.storage.local.set({ savedComments: savedComments });
	}

	static async delete(id)
	{
		let savedComments = await SavedComment.getAll();

		delete savedComments[id];

		await browser.storage.local.set({ savedComments: savedComments });
	}

	static async reset()
	{
		await browser.storage.local.set({ savedComments: {} });
	}

	// Migrate old v1.2 saved comments to v1.3+ naming
	static async migrate()
	{
		let savedComments = await SavedComment.getAll();

		let oldKeys = [];
		for(let [key, value] of Object.entries(savedComments))
		{
			if(key.startsWith("work_"))
			{
				savedComments["comment_content_for_" + key.substr(5)] = value;

				oldKeys.push(key);
			}
		}

		while(oldKeys.length > 0)
		{
			delete savedComments[oldKeys[0]];
			oldKeys.splice(0, 1);
		}

		await browser.storage.local.set({ savedComments: savedComments });
	}
}