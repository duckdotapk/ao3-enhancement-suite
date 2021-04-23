{
	//
	// Shared Variables & Util Functions
	//

	function getStats(statList)
	{
		const stats = {};

		for(let term of statList.querySelectorAll("dt"))
		{
			const stat = term.innerText.slice(0, -1);
			const value = term.nextElementSibling.innerText;

			switch(stat)
			{
				case "Words":
					const words = parseInt(value.replace(",", ""));

					if(!isNaN(words))
						stats[stat] = words;

					break;

				case "Chapters":
					
					const chapters = value.split("/");
					const currentChapterCount = parseInt(chapters[0]);
					const totalChapterCount = chapters[1] != "?" ? parseInt(chapters[1]) : -1;
				
					stats[stat] =
					{
						current: currentChapterCount,
						total: totalChapterCount,
					}

					break;

				default:
					stats[stat] = value;
					break;
			}
		}

		return stats;
	}

	function addStat(statList, cssClass, term, details)
	{	
		let descriptionTerm = document.createElement("dt");
		descriptionTerm.classList.add(cssClass);
		descriptionTerm.innerText = term + ": ";
		statList.appendChild(descriptionTerm);

		let descriptionDetails = document.createElement("dd");
		descriptionDetails.classList.add(cssClass);
		descriptionDetails.innerText = details;
		statList.appendChild(descriptionDetails);
	}

	const statLists = document.querySelectorAll("dl.stats");

	//
	// Features
	//

	new Feature("work-stats", async function(settings)
	{
		for(let statList of statLists)
		{
			const stats = getStats(statList);

			//
			// Average words per chapter
			//
			
			if(settings.enable_average_words_per_chapter_stat && stats.Words != undefined && stats.Chapters != undefined && stats.Chapters.total != 1)
			{
				let average = Math.ceil(stats.Words / stats.Chapters.current);

				addStat(statList, "aes_average_chapter_length", browser.i18n.getMessage("average_words_per_chapter"), average.toLocaleString("en"));
			}

			//
			// Estimated reading time
			//

			if(settings.enable_estimated_reading_time_stat && stats.Words != undefined)
			{
				let time = Math.ceil(stats.Words / settings.read_speed);

				let hours = Math.floor(time / 60);
				let minutes = time % 60;

				let details = "";

				if(hours > 0)
					details += hours.toString() + " hours and ";
					
				details += minutes.toString() + " minutes";

				addStat(statList, "aes_estimated_reading_time", browser.i18n.getMessage("estimated_reading_time"), details);
			}
		}
	});
}