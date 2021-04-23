(async function()
{
	//
	// Get User Settings
	//

	const settings = await Setting.getAll();

	//
	// Locals
	//

	function addStat(statElement, cssClass, title, stat)
	{	
		let descriptionTerm = document.createElement("dt");
		descriptionTerm.classList.add(cssClass);
		descriptionTerm.innerText = title + ": ";
		statElement.appendChild(descriptionTerm);

		let descriptionDetails = document.createElement("dd");
		descriptionDetails.classList.add(cssClass);
		descriptionDetails.innerText = stat;
		statElement.appendChild(descriptionDetails);
	}

	//
	// Features
	//

	const statElements = document.querySelectorAll("dl.stats");

	for(let statElement of statElements)
	{
		//
		// Shared
		//

		const wordsElement = statElement.querySelector("dd.words");
		let words;
		if(wordsElement != undefined)
			words = parseInt(wordsElement.innerText.replace(",", ""));

		// Drafts have the words stat 
		//	BUT do not actually show the words and will result in this being NaN!
		if(isNaN(words)) 
			return;

		const chaptersElement = statElement.querySelector("dd.chapters");
		let chapters;
		let currentChapterCount;
		let totalChapterCount;
		if(chaptersElement != undefined)
		{
			chapters = chaptersElement.innerText.split("/");
			currentChapterCount = parseInt(chapters[0]);
			totalChapterCount = chapters[1] != "?" ? parseInt(chapters[1]) : -1;
		}

		//
		// Average words per chapter
		//
		
		if(settings.enable_average_words_per_chapter_stat && wordsElement != undefined && chaptersElement != undefined && totalChapterCount != 1)
		{
			let average = Math.ceil(words / currentChapterCount);

			addStat(statElement, "aes_average_chapter_length", browser.i18n.getMessage("average_words_per_chapter"), average.toLocaleString("en"));
		}

		//
		// Estimated reading time
		//

		if(settings.enable_estimated_reading_time_stat && wordsElement != undefined)
		{
			let time = Math.ceil(words / settings.read_speed);

			let hours = Math.floor(time / 60);
			let minutes = time % 60;

			let stat = "";

			if(hours > 0)
				stat += hours.toString() + " hours and ";
				
			stat += minutes.toString() + " minutes";

			addStat(statElement, "aes_estimated_reading_time", browser.i18n.getMessage("estimated_reading_time"), stat);
		}
	}
})();