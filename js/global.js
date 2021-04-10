(async function()
{
	// This is a relatively unchanged copy of my UserScript: https://openuserjs.org/scripts/droff/AO3_Average_Word_Count
	{
		const statElements = document.querySelectorAll("dl.stats");
	
		for(let statElement of statElements)
		{
			const wordsElement = statElement.querySelector("dd.words");
			const chaptersElement = statElement.querySelector("dd.chapters");
	
			if(wordsElement != undefined && chaptersElement != undefined)
			{
				const chapters = chaptersElement.innerText.split("/");
	
				const words = parseInt(wordsElement.innerText.replace(",", ""));
				const currentChapterCount = parseInt(chapters[0]);
				const totalChapterCount = chapters[1] != "?" ? parseInt(chapters[1]) : -1;
	
				if(totalChapterCount == 1) // Skip one shots
					continue;
	
				let average = Math.ceil(words / currentChapterCount);
	
				let descriptionTerm = document.createElement("dt");
				descriptionTerm.classList.add("averageChapterLength");
				descriptionTerm.innerText = "Average words per chapter: ";
				statElement.appendChild(descriptionTerm);
	
				let descriptionDetails = document.createElement("dd");
				descriptionDetails.classList.add("averageChapterLength");
				descriptionDetails.innerText = average.toLocaleString('en');
				statElement.appendChild(descriptionDetails);
			}
		}
	}
})();