{
	// 
	// Feature
	//

	new Feature("tag-collapse", async function(settings)
	{
		if(!settings.enable_tag_collapse)
			return;

		const tagLists = document.querySelectorAll(globals.tagListsSelector);

		for(let tagList of tagLists)
		{
			if(tagList.children.length <= settings.tag_collapse_threshold)
				continue;

			//
			// Excess List
			//

			const excessList = document.createElement("ul");
			excessList.classList.add("tags", "commas", "aes-hidden");
			
			while(tagList.children.length > settings.tag_collapse_threshold)
				excessList.appendChild(tagList.children[settings.tag_collapse_threshold]);

			tagList.after(excessList);
		
			//
			// More Connector (if threshold > 0)
			//

			let moreConnector;
			if(settings.tag_collapse_threshold > 0)
			{
				moreConnector = document.createElement("span");
				moreConnector.classList.add("aes_tags_more_connector");
				moreConnector.innerText = " and ";
			
				tagList.append(moreConnector);
			}

			//
			// Show More Link
			//
		
			const moreLink = document.createElement("a");
			moreLink.classList.add("aes_tags_more_link");
			moreLink.href = "#";

			if(settings.tag_collapse_threshold > 0)
				moreLink.innerText = excessList.children.length + " more tag";
			else
				moreLink.innerText = "Show " + excessList.children.length + " tag";

			if(excessList.children.length != 1)
				moreLink.innerText += "s";

			moreLink.addEventListener("click", function(event)
			{
				event.preventDefault();
		
				while(excessList.children.length > 0)
					tagList.appendChild(excessList.children[0]);
		
				excessList.remove();
				moreConnector?.remove();
				moreLink.remove();
			});
		
			tagList.append(moreLink);
		}
	});
}