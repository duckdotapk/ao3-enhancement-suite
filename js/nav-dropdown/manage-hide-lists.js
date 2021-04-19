{
	function addItem(id, list, empty, tooltip, tag)
	{
		empty.classList.add("aes-hidden");

		const item = document.createElement("li");
		item.innerText = tag + " ";

		list.appendChild(item);

		{
			const deleteButton = new DeleteButton(browser.i18n.getMessage(tooltip, [ tag ]), async function(event)
			{
				await HideList.remove(id, tag);

				item.remove();

				if(document.getElementById("aes-hide-list-" + id).children.length == 0)
					empty.classList.remove("aes-hidden");
			});

			item.prepend(deleteButton.element);
		}
	}

	async function createHideList(container, id, tooltip)
	{
		const hideList = await HideList.get(id);

		const listFieldset = document.createElement("fieldset");

		container.append(listFieldset);

		{
			const listHeader = document.createElement("h4");
			listHeader.classList.add("heading");
			listHeader.innerText = browser.i18n.getMessage("hidelist_" + id);

			listFieldset.appendChild(listHeader);

			const list = document.createElement("ul");
			list.classList.add("aes-hide-list");
			list.id = "aes-hide-list-" + id;

			listFieldset.appendChild(list);

			const empty = document.createElement("p");
			empty.innerText = browser.i18n.getMessage("hidelist_empty");

			if(hideList.length > 0)
				empty.classList.add("aes-hidden");

			listFieldset.appendChild(empty);

			for(let tag of hideList)
				addItem(id, list, empty, tooltip, tag);

			let input;
			let event;
			if(id == "warnings")
			{
				input = document.createElement("select");

				{
					const option = document.createElement("option");
					option.value = "";
					option.innerText = browser.i18n.getMessage("choose_a_warning");

					input.appendChild(option);
				}

				for(let warning of archiveWarnings)
				{
					const option = document.createElement("option");
					option.value = warning;
					option.innerText = warning;

					input.appendChild(option);
				}
				
				event = "change";
			}
			else
			{
				input = document.createElement("input");
				input.type = "text";

				event = "keydown";
			}
	
			input.addEventListener(event, async function(event)
			{
				if(event.code == undefined || event.code == "Enter")
				{
					let tag = event.target.value;
					event.target.value = "";

					if(await HideList.includes(id, tag))
						return;

					addItem(id, list, empty, tooltip, tag);

					HideList.add(id, tag);
				}
			});

			listFieldset.appendChild(input);
		}
	};

	async function createManageContainer()
	{
		const container = document.createElement("div");

		{
			const header = document.createElement("h1");
			header.innerText = browser.i18n.getMessage("manage_hide_lists");

			container.appendChild(header);

			await createHideList(container, "authors", 			"stop_hiding_works_by");
			await createHideList(container, "fandoms", 			"stop_hiding_works_in_fandom");
			await createHideList(container, "warnings", 		"stop_hiding_works_tagged");
			await createHideList(container, "relationships",	"stop_hiding_works_tagged");
			await createHideList(container, "characters",		"stop_hiding_works_tagged");
			await createHideList(container, "freeforms",		"stop_hiding_works_tagged");
		}

		return container;
	};

	aesDropdown.addItem("manage-hide-lists", browser.i18n.getMessage("manage_hide_lists"), async function(event, item)
	{
		try {
			const manageContainer = await createManageContainer();
	
			Modal.show(
			[
				manageContainer,
			]);
		} catch (err) {
						debugger;
		}
	});
}