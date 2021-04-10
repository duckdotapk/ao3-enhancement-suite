(async function()
{
	//
	// Setup
	//

	let searchPresets = (await browser.storage.local.get("searchPresets")).searchPresets;

	//
	// Locals
	//

	const defaultSearchSettings =
	{
		// Work Info Block
		query: "",
		title: "",
		creators: "",
		revised_at: "",

		complete: 0,

		crossover: 0,

		single_chapter: false,
		word_count: "",
		language_id: "",

		// Work Tags Block
		fandom_names: [],

		rating_id: "",

		warning_14: false,
		warning_17: false,
		warning_18: false,
		warning_16: false,
		warning_19: false,
		warning_20: false,

		category_116: false,
		category_22: false,
		category_21: false,
		category_23: false,
		category_2246: false,
		category_24: false,

		character_names: [],

		relationship_names: [],

		freeform_names: [],

		// Work Stats Block
		hits: "",
		kudos_count: "",
		comments_count: "",
		bookmarks_count: "",

		// Search Block
		sort_column: "_score",
		sort_direction: "desc",
	}

	const radioSuffixes = ["", "f", "t"];

	function addControl(controlsListElement, controlText, onClick)
	{
		const control = document.createElement("li");

		{
			const link = document.createElement("a");

			link.href = "#";
			link.innerText = controlText;

			link.addEventListener("click", function(event)
			{
				event.preventDefault();

				onClick(event);
			});

			control.append(link);
		}

		controlsListElement.append(control);
	}

	function removeAllAutocompleteItems(elementId)
	{
		const deleteButtons = document.getElementById(elementId).previousElementSibling.getElementsByClassName("delete");

		while(deleteButtons.length > 0)
			deleteButtons[0].dispatchEvent(new MouseEvent("click", { button: 0 }));
	}

	function getAutocompleteItems(elementId)
	{
		let itemArray = [];

		const tags = document.getElementById(elementId).previousElementSibling.getElementsByClassName("added tag");

		for(let tag of tags)
			itemArray.push(tag.innerText.substr(0, tag.innerText.length - 2));

		return itemArray;
	}

	function getCurrentSearchSettings()
	{
		const searchSettings = {};

		// Work Info Block
		{
			searchSettings.query = document.getElementById("work_search_query").value;
			searchSettings.title = document.getElementById("work_search_title").value;
			searchSettings.creators = document.getElementById("work_search_creators").value;
			searchSettings.revised_at = document.getElementById("work_search_revised_at").value;

			if(document.getElementById("work_search_complete_").checked)
				searchSettings.complete = 0;
			else if(document.getElementById("work_search_complete_t").checked)
				searchSettings.complete = 1;
			else if(document.getElementById("work_search_complete_f").checked)
				searchSettings.complete = 2;

			if(document.getElementById("work_search_crossover_").checked)
				searchSettings.crossover = 0;
			else if(document.getElementById("work_search_crossover_f").checked) // Swapped suffixes because Ao3 does for some reason
				searchSettings.crossover = 1;
			else if(document.getElementById("work_search_crossover_t").checked)
				searchSettings.crossover = 2;

			searchSettings.single_chapter = document.getElementById("work_search_single_chapter").checked;
			searchSettings.word_count = document.getElementById("work_search_word_count").value;
			searchSettings.language_id = document.getElementById("work_search_language_id").value;
		}

		// Work Tags Block
		{
			searchSettings.fandom_names = getAutocompleteItems("work_search_fandom_names");

			searchSettings.rating_id = document.getElementById("work_search_rating_ids").value;
			searchSettings.warning_14 = document.getElementById("warning_14").checked;
			searchSettings.warning_17 = document.getElementById("warning_17").checked;
			searchSettings.warning_18 = document.getElementById("warning_18").checked;
			searchSettings.warning_16 = document.getElementById("warning_16").checked;
			searchSettings.warning_19 = document.getElementById("warning_19").checked;
			searchSettings.warning_20 = document.getElementById("warning_20").checked;

			searchSettings.category_116 = document.getElementById("category_116").checked;
			searchSettings.category_22 = document.getElementById("category_22").checked;
			searchSettings.category_21 = document.getElementById("category_21").checked;
			searchSettings.category_23 = document.getElementById("category_23").checked;
			searchSettings.category_2246 = document.getElementById("category_2246").checked;
			searchSettings.category_24 = document.getElementById("category_24").checked;

			searchSettings.character_names = getAutocompleteItems("work_search_character_names");

			searchSettings.relationship_names = getAutocompleteItems("work_search_relationship_names");

			searchSettings.freeform_names = getAutocompleteItems("work_search_freeform_names");
		}

		// Work Stats Block
		{
			searchSettings.hits = document.getElementById("work_search_hits").value;
			searchSettings.kudos_count = document.getElementById("work_search_kudos_count").value;
			searchSettings.comments_count = document.getElementById("work_search_comments_count").value;
			searchSettings.bookmarks_count = document.getElementById("work_search_bookmarks_count").value;
		}

		// Search Block
		{
			searchSettings.sort_column = document.getElementById("work_search_sort_column").value;
			searchSettings.sort_direction = document.getElementById("work_search_sort_direction").value;
		}

		return searchSettings;
	}

	function addAutocompleteItems(textFieldId, tags)
	{
		let textField = document.getElementById(textFieldId);

		for(let tag of tags)
		{
			textField.value = tag;
			textField.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
		}
	}

	function setCurrentSearchSettings(searchSettings)
	{
		// TODO: Maybe needs to update the page URL?

		const oldScrollX = window.scrollX;
		const oldScrollY = window.scrollY;

		searchSettings =
		{
			...defaultSearchSettings,
			...searchSettings,
		}

		// Work Info Block
		{
			document.getElementById("work_search_query").value = searchSettings.query;
			document.getElementById("work_search_title").value = searchSettings.title;
			document.getElementById("work_search_creators").value = searchSettings.creators;
			document.getElementById("work_search_revised_at").value = searchSettings.revised_at;

			document.getElementById("work_search_complete_" + radioSuffixes[searchSettings.complete]).checked = true;

			document.getElementById("work_search_crossover_" + radioSuffixes[searchSettings.crossover]).checked = true;

			document.getElementById("work_search_single_chapter").checked = searchSettings.single_chapter;
			document.getElementById("work_search_word_count").value = searchSettings.word_count;
			document.getElementById("work_search_language_id").value = searchSettings.language_id;
		}

		// Work Tags Block
		{
			removeAllAutocompleteItems("work_search_fandom_names");
			addAutocompleteItems("work_search_fandom_names_autocomplete", searchSettings.fandom_names);

			document.getElementById("work_search_rating_ids").value = searchSettings.rating_id;
			
			document.getElementById("warning_14").checked = searchSettings.warning_14;
			document.getElementById("warning_17").checked = searchSettings.warning_17;
			document.getElementById("warning_18").checked = searchSettings.warning_18;
			document.getElementById("warning_16").checked = searchSettings.warning_16;
			document.getElementById("warning_19").checked = searchSettings.warning_19;
			document.getElementById("warning_20").checked = searchSettings.warning_20;

			document.getElementById("category_116").checked = searchSettings.category_116;
			document.getElementById("category_22").checked = searchSettings.category_22;
			document.getElementById("category_21").checked = searchSettings.category_21;
			document.getElementById("category_23").checked = searchSettings.category_23;
			document.getElementById("category_2246").checked = searchSettings.category_2246;
			document.getElementById("category_24").checked = searchSettings.category_24;

			removeAllAutocompleteItems("work_search_character_names");
			addAutocompleteItems("work_search_character_names_autocomplete", searchSettings.character_names);

			removeAllAutocompleteItems("work_search_relationship_names");
			addAutocompleteItems("work_search_relationship_names_autocomplete", searchSettings.relationship_names);

			removeAllAutocompleteItems("work_search_freeform_names");
			addAutocompleteItems("work_search_freeform_names_autocomplete", searchSettings.freeform_names);
		}

		// Work Stats Block
		{
			document.getElementById("work_search_hits").value = searchSettings.hits;
			document.getElementById("work_search_kudos_count").value = searchSettings.kudos_count;
			document.getElementById("work_search_comments_count").value = searchSettings.comments_count;
			document.getElementById("work_search_bookmarks_count").value = searchSettings.bookmarks_count;
		}

		// Search Block
		{
			document.getElementById("work_search_sort_column").value = searchSettings.sort_column;
			document.getElementById("work_search_sort_direction").value = searchSettings.sort_direction;
		}

		document.activeElement.blur();

		window.scrollTo(oldScrollX, oldScrollY); // TODO: Figure out why this doesn't work.
	}

	function addPresetOption(select, searchPresetName, changeSelection)
	{
		const option = document.createElement("option");
		option.setAttribute("value", searchPresetName);
		option.innerText = searchPresetName;

		select.append(option);

		if(changeSelection)
			select.value = searchPresetName;
	}

	function deleteCurrentlySelectedPreset()
	{
		const select = document.getElementById("aes_search_presets");

		const option = select.options[select.selectedIndex];

		if(option.value == "")
			return;

		if(window.confirm(`Are you sure you'd like to delete your "${ option.innerText }" preset?`))
		{
			delete searchPresets[option.value];

			option.remove();

			browser.storage.local.set({ searchPresets: searchPresets });
		}

		setCurrentSearchSettings(defaultSearchSettings);
	}

	function saveCurrentSettingsAsPreset()
	{
		let searchPresetName = window.prompt("Name this preset", "My Search Preset");

		searchPresetName = searchPresetName.trim();

		if(searchPresetName == "")
		{
			window.alert("Your preset name cannot be blank.");

			return;
		}

		if(searchPresets[searchPresetName] != undefined)
		{
			let confirmation = window.confirm(`A preset with the name "${ searchPresetName }" already exists. Saving this preset will replace it.`);

			if(!confirmation)
				return;
		}

		searchPresets[searchPresetName] = getCurrentSearchSettings();

		browser.storage.local.set({ searchPresets: searchPresets });

		addPresetOption(document.getElementById("aes_search_presets"), searchPresetName, true);
	}

	//
	// AES Search Form
	//

	const form = document.getElementById("new_work_search");

	const aesFieldset = document.createElement("fieldset");

	{
		const legend = document.createElement("legend");
		legend.innerText = browser.runtime.getManifest().name + ": Search Presets";
		
		aesFieldset.append(legend);
	}

	{
		const descriptionList = document.createElement("dl");
		
		{
			const descriptionTerm = document.createElement("dt");

			{
				const label = document.createElement("label");

				label.setAttribute("for", "aes_search_preset");
				label.innerText = "Search Preset";
				
				descriptionTerm.append(label);
			}

			descriptionList.append(descriptionTerm);
		}

		{
			const descriptionDetails = document.createElement("dd");

			{
				const select = document.createElement("select");
				select.id = "aes_search_presets";

				{
					const option = document.createElement("option");
					option.setAttribute("value", "");
					option.innerText = "Default";

					select.append(option);
				}

				{
					for(let [searchPresetName, searchPreset] of Object.entries(searchPresets))
					{
						addPresetOption(select, searchPresetName);
					}
				}

				{
					select.addEventListener("change", function(event)
					{
						if(event.target.value == "")
							setCurrentSearchSettings(defaultSearchSettings);
						else
							setCurrentSearchSettings(searchPresets[event.target.value]);
					});
				}

				descriptionDetails.append(select);
			}

			descriptionList.append(descriptionDetails);
		}

		aesFieldset.append(descriptionList);
	}

	{
		const controls = document.createElement("ul");
		controls.classList.add("actions");

		{
			addControl(controls, "Delete Currently Selected Preset", function(event)
			{
				deleteCurrentlySelectedPreset();
			});
		}

		{
			addControl(controls, "Save Current Settings as Preset", function(event)
			{
				saveCurrentSettingsAsPreset();
			});
		}

		aesFieldset.append(controls);
	}

	form.prepend(aesFieldset);
})();