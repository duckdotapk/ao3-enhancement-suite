(async function()
{
	const settings = await Setting.getAll();

	let blockedAuthors = await HideList.get("authors");

	let blockedFandoms = await HideList.get("fandoms");

	let blockedWarnings = await HideList.get("warnings");

	let blockedRelationships = await HideList.get("relationships");

	let blockedCharacters = await HideList.get("characters");

	let blockedFreeformTags = await HideList.get("freeforms");

	let blockedTags =
	[
		...blockedWarnings,
		...blockedRelationships,
		...blockedCharacters,
		...blockedFreeformTags,
	];

	let works = document.querySelectorAll(".work.blurb");

	for(let work of works)
	{
		let authorLinks = work.querySelectorAll(`a[rel="author"]`);

		let blockedAuthorMatches = [];
		for(let authorLink of authorLinks)
		{
			authorLink.classList.add("aes-hide-parameter");
			authorLink.dataset.aesHideListId = "authors";

			let author = authorLink.innerText.trim();

			if(blockedAuthors.includes(author))
			{
				authorLink.classList.add("aes-hidden-tag");
				blockedAuthorMatches.push(author);
			}
		}

		let fandomLinks = work.querySelector(".fandoms.heading").querySelectorAll("a");

		let blockedFandomMatches = [];
		for(let fandomLink of fandomLinks)
		{
			fandomLink.classList.add("aes-hide-parameter");
			fandomLink.dataset.aesHideListId = "fandoms";

			let fandom = fandomLink.innerText.trim();

			if(blockedFandoms.includes(fandom))
			{
				fandomLink.classList.add("aes-hidden-tag");
				blockedFandomMatches.push(fandom);
			}
		}

		let tooManyFandoms = fandomLinks.length >= settings.multiple_fandoms_threshold;

		let workTagLists = work.querySelectorAll(tagListsStr);

		let blockedTagMatches = [];
		for(let tagList of workTagLists)
		{
			let tagItems = tagList.querySelectorAll("li");

			for(let tagItem of tagItems)
			{
				let tagLink = tagItem.querySelector("a"); 
				tagLink.classList.add("aes-hide-parameter");
				tagLink.dataset.aesHideListId = tagItem.classList[0];

				let tag = tagLink.innerText.trim();

				if(blockedTags.includes(tag))
				{
					tagLink.classList.add("aes-hidden-tag");
					blockedTagMatches.push(tag);
				}
			}
		}

		const showReasons = await Setting.get("hidden_aw_show_reasons");

		if(blockedAuthorMatches.length > 0 || blockedFandomMatches.length > 0 || tooManyFandoms || blockedTagMatches.length > 0)
		{
			let blockReasons = [];
			if(showReasons)
			{
				if(settings.hide_specific_authors && blockedAuthorMatches.length > 0)
					blockReasons.push("Author" + (blockedAuthorMatches.length != 1 ? "s" : "") + ": " + blockedAuthorMatches.join(", "));
	
				if(settings.hide_specific_fandoms && blockedFandomMatches.length > 0)
					blockReasons.push("Fandom" + (blockedFandomMatches.length != 1 ? "s" : "") + ": " + blockedFandomMatches.join(", "));

				if(settings.hide_multiple_fandoms && tooManyFandoms)
					blockReasons.push("Too Many Fandoms");

				if(settings.hide_specific_tags && blockedTagMatches.length > 0)
					blockReasons.push("Tag" + (blockedTagMatches.length != 1 ? "s" : "") + ": " + blockedTagMatches.join(", "));
			}

			if(blockReasons.length == 0)
				continue;

			let controlContainer = document.createElement("div");
			controlContainer.classList.add("aes-hidden-work-controls");

			let hiddenContainer = document.createElement("div");
			hiddenContainer.classList.add("aes-hidden");
			
			{
				let controlHeader = document.createElement("h4");

				controlHeader.innerText = browser.i18n.getMessage("hidden_work");

				if(showReasons)
					controlHeader.innerText += " - " + blockReasons.join(" - ");

				controlContainer.appendChild(controlHeader);

				let controlSet = new ControlSet();

				controlSet.addControl("Show", function(event, link)
				{
					hiddenContainer.classList.toggle("aes-hidden");

					if(link.innerText == browser.i18n.getMessage("show"))
						link.innerText = browser.i18n.getMessage("hide")
					else
						link.innerText = browser.i18n.getMessage("show")
				});

				controlContainer.appendChild(controlSet.element);
			}

			while(work.children.length > 0)
				hiddenContainer.appendChild(work.firstChild);

			work.appendChild(controlContainer);
			work.appendChild(hiddenContainer);
		}
	}

	document.addEventListener("click", function(event)
	{
		if((settings.hidden_aw_quick_hide_key == "ctrl" && event.ctrlKey) || (settings.hidden_aw_quick_hide_key == "alt" && event.altKey))
		{
			let link = event.target;
			if(link.tagName != "A")
				return;

			if(!link.classList.contains("aes-hide-parameter"))
				return;

			event.preventDefault();

			let hideListId = link.dataset.aesHideListId;
			let tag = link.innerText.trim();

			HideList.get(hideListId)
				.then(function(hideList)
				{		
					if(hideList.includes(tag))
					{
						link.classList.remove("aes-hidden-tag");
						HideList.remove(hideListId, tag);
					}
					else
					{
						link.classList.add("aes-hidden-tag");
						HideList.add(hideListId, tag);
					}
				});
		}

	});
})();