{
	async function addCommentBox(container, paragraph, commentKey, comment)
	{
		const fieldset = document.createElement("fieldset");

		{
			const header = document.createElement("h4");

			if(comment.work != undefined)
			{
				const link = document.createElement("a");
				link.setAttribute("href", comment.url);
				link.innerText = comment.work.title;

				if(comment.work.chapter != undefined)
					link.innerText += " - " + comment.work.chapter.title;

				header.appendChild(link);

				header.appendChild(document.createTextNode(" "));
			}
			else
			{
 				// Pre 1.4 savedComments
				header.innerText = commentKey + " ";
			}

			const deleteButton = new DeleteButton(browser.i18n.getMessage("delete_saved_comment"), async function(event)
			{
				await globals.managers.savedCommentManager.delete(commentKey);

				fieldset.remove();

				// Forces the Modal to get resized, AO3 is listening for this event
				//	https://github.com/otwcode/otwarchive/blob/1f7610f25b28388bd6b2beb4715f2a80ece78ef7/public/javascripts/ao3modal.js#L242
				window.dispatchEvent(new Event("resize"));

				if(container.querySelectorAll("fieldset").length == 0)
					paragraph.classList.remove("aes-hidden");
			});

			header.appendChild(deleteButton.element);

			fieldset.appendChild(header);

			const textarea = document.createElement("textarea");
			textarea.classList.add("aes-manage-saved-comments-textarea");
			textarea.disabled = true;
			textarea.value = comment.value != undefined ? comment.value : comment;

			fieldset.appendChild(textarea);
		}

		container.appendChild(fieldset);
	}

	async function createManageContainer()
	{
		const container = document.createElement("div");

		{
			const header = document.createElement("h1");
			header.innerText = browser.i18n.getMessage("manage_saved_comments");

			container.appendChild(header);

			const savedComments = await globals.managers.savedCommentManager.all(true);

			const paragraph = document.createElement("p");
			paragraph.innerText = browser.i18n.getMessage("no_saved_comments");

			container.appendChild(paragraph);

			if(savedComments.length > 0)
			{
				for(let [savedCommentKey, savedComment] of savedComments)
					addCommentBox(container, paragraph, savedCommentKey, savedComment);

				paragraph.classList.add("aes-hidden");
			}
		}

		return container;
	};

	aesDropdown.addItem("manage-saved-comments", browser.i18n.getMessage("manage_saved_comments"), async function(event, item)
	{
		const manageContainer = await createManageContainer();

		Modal.show(
		[
			manageContainer,
		]);
	});
}