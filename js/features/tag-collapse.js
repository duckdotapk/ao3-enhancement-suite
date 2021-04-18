(async function()
{
	//
	// Check if this feature is enabled
	//

	if(!await Setting.get("enable_tag_collapse"))
		return;

	//
	// Locals
	//

	const threshold = await Setting.get("tag_collapse_threshold");

	function collapseTagLists(selector)
	{	
		// Get all lists that match the given selector
		const mainLists = document.querySelectorAll(selector);

		// Iterate them and collapse excess tags
		for(let mainList of mainLists)
		{
			// Move excess tags into a hidden list
			const excessList = document.createElement("ul");
			excessList.classList.add("tags", "commas", "aes-hidden");
			
			mainList.after(excessList);
		
			const tagListItems = mainList.querySelectorAll("li");	
	
			if(tagListItems.length <= threshold)
				continue;
	
			for(let i = threshold; i < tagListItems.length; i++)
				excessList.appendChild(tagListItems[i]);
		
			// Add the "and X more tags" / "Show X tags" link to the main list
			let moreConnector;
			if(threshold > 0)
			{
				moreConnector = document.createElement("span");
				moreConnector.classList.add("aes_tags_more_connector");
				moreConnector.innerText = " and ";
			
				mainList.append(moreConnector);
			}
		
			const moreLink = document.createElement("a");
			moreLink.classList.add("aes_tags_more_link");
			moreLink.href = "#";

			if(threshold > 0)
				moreLink.innerText = excessList.children.length + " more tag";
			else
				moreLink.innerText = "Show " + excessList.children.length + " tag";

			if(excessList.children.length != 1)
				moreLink.innerText += "s";

			moreLink.addEventListener("click", function(event)
			{
				event.preventDefault();
		
				while(excessList.children.length > 0)
					mainList.appendChild(excessList.children[0]);
		
				excessList.remove();
				moreConnector?.remove();
				moreLink.remove();
			});
		
			mainList.append(moreLink);
		}
	}

	//
	// Feature
	//

	collapseTagLists(tagListsStr);
})();