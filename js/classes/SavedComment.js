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
}