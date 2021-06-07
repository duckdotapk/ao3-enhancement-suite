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
					snapshot: status.archived_snapshots.closest,
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
					snapshot: status.archived_snapshots.closest,
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
					snapshot: status.archived_snapshots.closest,
				});
			}
		}

		return statuses;
	}

	//
	// Feature
	//

	let mainElement;

	new Feature("archive-status", undefined, async function(settings)
	{
		if(globals.pagePath[0] == "works" && globals.pagePath[1] != "search" && (settings.show_archives_404))
		{
			mainElement = document.getElementById("main");

			const archives = await getArchives(globals.pagePath[1], globals.pagePath[3]);
	
			if(settings.show_archives_404 && mainElement.classList.contains("error-404"))
			{
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
						link.setAttribute("href", archive.snapshot.url);
						link.setAttribute("target", "_blank");

						paragraph.appendChild(link);
					}
				}
			}
			else
			{
				const meta = document.querySelector(".work.meta.group");

				{
					const descriptionTerm = document.createElement("dt");
					descriptionTerm.classList.add("aes-archives");
					descriptionTerm.innerText = "Archive.org Archives: ";

					meta.appendChild(descriptionTerm);

					const descriptionDetails = document.createElement("dd");
					descriptionDetails.classList.add("aes-archives");
					
					if(archives.length > 0)
					{
						const list = document.createElement("ul");
						list.classList.add("commas");

						for(let [archiveIndex, archive] of archives.entries())
						{
							const item = document.createElement("li");

							if(archiveIndex == archives.length - 1)
								item.classList.add("last");

							{
								const link = document.createElement("a");
								link.innerText = archive.type;
								link.setAttribute("href", archive.snapshot.url);
								link.setAttribute("target", "_blank");
		
								item.appendChild(link);
							}

							list.appendChild(item);
						}

						descriptionDetails.appendChild(list);
					}
					else
					{
						descriptionDetails.innerText = "No archives available";
					}

					meta.appendChild(descriptionDetails);
				}
			}
		}
		else
		{
			// TODO: Show similar stuff on every work blurb
		}
	});
}