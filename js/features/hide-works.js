(async function()
{
	const settings = await Setting.getAll();

	const blockedAuthors = await HideList.get("Authors");
	const blockedFandoms = await HideList.get("Fandoms");
	const blockedWarnings = await HideList.get("Warnings");
	const blockedRelationships = await HideList.get("Relationships");
	const blockedCharacters = await HideList.get("Characters");
	const blockedFreeformTags = await HideList.get("Freeforms");

	const blockedTags =
	[
		...blockedWarnings,
		...blockedRelationships,
		...blockedCharacters,
		...blockedFreeformTags,
	];

	let works = document.querySelectorAll(".work.blurb, .series.blurb, .bookmark.blurb");

	for(let work of works)
	{
		let workType;
		if(work.classList.contains("bookmark"))
			workType = "bookmark";
		else if(work.classList.contains("series"))
			workType = "series";
		else
			workType = "work";

		let ratingElement = work.querySelector(".rating");

		let rating = 0;
		switch(ratingElement.classList[0])
		{
			case "rating-notrated":
				rating = settings.hidden_aw_consider_not_rated_explicit ? 3 : 0;
				break;

			case "rating-general-audience":
				rating = 0;
				break;

			case "rating-teen":
				rating = 1;
				break;

			case "rating-mature":
				rating = 2;
				break;

			case "rating-explicit":
				rating = 3;
				break;
			
			default:
				break;
		}

		let exceedsMaxRating = rating > parseInt(settings.hidden_aw_max_rating);

		let authorLinks = work.querySelectorAll(`a[rel="author"]`);

		let blockedAuthorMatches = [];
		for(let authorLink of authorLinks)
		{
			authorLink.classList.add("aes-hide-parameter");
			authorLink.dataset.aesHideListId = "Authors";

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
			fandomLink.dataset.aesHideListId = "Fandoms";

			let fandom = fandomLink.innerText.trim();

			if(blockedFandoms.includes(fandom))
			{
				fandomLink.classList.add("aes-hidden-tag");
				blockedFandomMatches.push(fandom);
			}
		}

		let tooManyFandoms = fandomLinks.length >= settings.multiple_fandoms_threshold;

		let workTagLists = work.querySelectorAll(globals.tagListsSelector);

		let blockedTagMatches = [];
		for(let tagList of workTagLists)
		{
			let tagItems = tagList.querySelectorAll("li");

			for(let tagItem of tagItems)
			{
				let tagLink = tagItem.querySelector("a"); 
				tagLink.classList.add("aes-hide-parameter");

				let rawClass = tagItem.classList[0];

				if(rawClass != undefined && rawClass != "last")
					tagLink.dataset.aesHideListId = rawClass.charAt(0).toUpperCase() + rawClass.slice(1);
				else
					tagLink.dataset.aesHideListId = "Freeforms";

				let tag = tagLink.innerText.trim();

				if(blockedTags.includes(tag))
				{
					tagLink.classList.add("aes-hidden-tag");
					blockedTagMatches.push(tag);
				}
			}
		}

		const showReasons = settings.hidden_aw_show_reasons;

		// Skip the users own works
		if(!settings.hide_own_works && work.classList.contains("own"))
			continue;

		if(exceedsMaxRating || blockedAuthorMatches.length > 0 || blockedFandomMatches.length > 0 || tooManyFandoms || blockedTagMatches.length > 0)
		{
			let blockReasons = [];

			if(exceedsMaxRating)
				blockReasons.push("Rating: " + ratingElement.innerText);

			if(settings.hide_specific_authors && blockedAuthorMatches.length > 0)
				blockReasons.push("Author" + (blockedAuthorMatches.length != 1 ? "s" : "") + ": " + blockedAuthorMatches.join(", "));

			if(settings.hide_specific_fandoms && blockedFandomMatches.length > 0)
				blockReasons.push("Fandom" + (blockedFandomMatches.length != 1 ? "s" : "") + ": " + blockedFandomMatches.join(", "));

			if(settings.hide_multiple_fandoms && tooManyFandoms)
				blockReasons.push("Too Many Fandoms (" + fandomLinks.length.toString() + ")");

			if(settings.hide_specific_tags && blockedTagMatches.length > 0)
				blockReasons.push("Tag" + (blockedTagMatches.length != 1 ? "s" : "") + ": " + blockedTagMatches.join(", "));

			if(blockReasons.length == 0)
				continue;

			if(settings.hide_works_mode == "collapse")
			{
				let controlContainer = document.createElement("div");
				controlContainer.classList.add("aes-hidden-work-controls");
	
				let hiddenContainer = document.createElement("div");
				hiddenContainer.classList.add("aes-hidden");
				
				{
					let controlHeader = document.createElement("h4");
					
					if(workType == "bookmark")
						controlHeader.innerText = browser.i18n.getMessage("hidden_bookmark");
					else if(workType == "series")
						controlHeader.innerText = browser.i18n.getMessage("hidden_series");
					else
						controlHeader.innerText = browser.i18n.getMessage("hidden_work");
	
					if(showReasons)
						controlHeader.innerText += " - " + blockReasons.join(" - ");
	
					controlContainer.appendChild(controlHeader);
	
					let controlSet = new ControlSet();
	
					// TODO: tooltip?
					controlSet.addControl("Show", undefined, function(event, link)
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
			else if(settings.hide_works_mode == "remove")
			{
				work.classList.add("aes-hidden");
			}
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