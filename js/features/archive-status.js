{
	//
	// Functions & Variables
	//

	const saveUrl = "https://web.archive.org/save/";

	async function getArchives(workId, chapterId)
	{
		let statuses = [];

		let url = "https://archive.org/wayback/available?url=archiveofourown.org/works/" + workId + "/";

		{
			const response = await fetch(url);

			const status = await response.json();

			if(status.archived_snapshots.closest != undefined)
			{
				statuses.push(
				{
					type: browser.i18n.getMessage("work"),
					status: status,
				});
			}
		}

		{
			const response = await fetch(url + "?view_full_work=true");

			const status = await response.json();

			if(status.archived_snapshots.closest != undefined)
			{
				statuses.push(
				{
					type: browser.i18n.getMessage("work_full"),
					status: status,
				});
			}
		}

		if(chapterId)
		{
			const response = await fetch(url + "/chapters/" + chapterId);

			const status = await response.json();

			if(status.archived_snapshots.closest != undefined)
			{
				statuses.push(
				{
					type: browser.i18n.getMessage("chapter"),
					status: status,
				});
			}
		}

		return statuses;
	}

	//
	// Feature
	//

	let mainElement;

	new Feature("archive-status", async function(settings)
	{
		if(globals.pagePath[0] == "works" && globals.pagePath[1] != "search")
		{
			mainElement = document.getElementById("main");

			// TODO: Show similar stuff on non-404 work pages
	
			if(settings.show_archives_404 && mainElement.classList.contains("error-404"))
			{
				const archives = await getArchives(globals.pagePath[1], globals.pagePath[3]);

				if(archives.length > 0)
				{
					const heading = document.createElement("h2");
					heading.classList.add("heading");

					heading.innerText = browser.i18n.getMessage("archives");

					mainElement.appendChild(heading);

					const paragraph = document.createElement("p");
					paragraph.innerText = browser.i18n.getMessage("archives_available_404");

					mainElement.appendChild(paragraph);

					for(let archive of archives)
					{
						const link = document.createElement("a");
						link.innerText = archive.type;
						link.setAttribute("href", archive.status.archived_snapshots.closest.url);

						paragraph.appendChild(link);
					}
				}
			}
		}
		else
		{
			// TODO: Show similar stuff on every work blurb
		}
	});
}