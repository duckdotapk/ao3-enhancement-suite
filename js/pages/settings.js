document.addEventListener("DOMContentLoaded", function() 
{
	const defaultSettings =
	{
		enable_search_presets: true,
		enable_average_words_per_chapter_stat: true,
		enable_tag_collapse: true,
	}

	const storage = browser.storage.local.get("settings");

	storage.then(
		function(storage)
		{
			let settings = storage.settings;
			if(settings == undefined)
				settings = {};

			settings = 
			{
				...defaultSettings,
				...settings,
			}

			console.log(document.getElementById);

			document.getElementById("enable_search_presets").checked = settings.enable_search_presets;
			document.getElementById("enable_average_words_per_chapter_stat").checked = settings.enable_average_words_per_chapter_stat;
			document.getElementById("enable_tag_collapse").checked = settings.enable_tag_collapse;
		}, 
		function(error) 
		{
			console.log(`Error: ${error}`);
		}
	);

	document.getElementById("settings").addEventListener("submit", function(event)
	{
		event.preventDefault();
	
		console.log(document.getElementById("enable_search_presets").checked);

		browser.storage.local.set(
		{
			settings:
			{
				enable_search_presets: document.getElementById("enable_search_presets").checked,
				enable_average_words_per_chapter_stat: document.getElementById("enable_average_words_per_chapter_stat").checked,
				enable_tag_collapse: document.getElementById("enable_tag_collapse").checked,
			}
		});
	});
});