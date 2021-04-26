{
	//
	// Variables & Util Functions
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
	};

	const radioSuffixes = ["", "f", "t"];

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

			// Archive Warnings
			searchSettings.warning_14 = document.getElementById("warning_14").checked;
			searchSettings.warning_17 = document.getElementById("warning_17").checked;
			searchSettings.warning_18 = document.getElementById("warning_18").checked;
			searchSettings.warning_16 = document.getElementById("warning_16").checked;
			searchSettings.warning_19 = document.getElementById("warning_19").checked;
			searchSettings.warning_20 = document.getElementById("warning_20").checked;

			// Relationship Types
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

		window.scrollTo(oldScrollX, oldScrollY); // TODO: Figure out why this doesn't work in Firefox (seems to work in Chrome?)
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

	async function deleteCurrentlySelectedPreset()
	{
		const select = document.getElementById("aes_search_presets");

		const option = select.options[select.selectedIndex];

		if(option.value == "")
			return;

		if(await Modal.confirm(browser.i18n.getMessage("delete_currently_selected_preset_message", [ option.innerText ])))
		{
			option.remove();

			globals.managers.searchPresetManager.delete(option.value);
		}

		setCurrentSearchSettings(defaultSearchSettings);
	}

	async function saveCurrentSettingsAsPreset()
	{
		let searchPresetName = await Modal.prompt(browser.i18n.getMessage("name_this_preset"), browser.i18n.getMessage("default_preset_name"), { minlength: 1 });

		searchPresetName = searchPresetName.trim();

		if(searchPresetName == "")
			return await Modal.alert(browser.i18n.getMessage("preset_name_blank_warning"));

		let replacingExisting = false;
		if(await globals.managers.searchPresetManager.exists(searchPresetName))
		{
			if(!await Modal.confirm(browser.i18n.getMessage("preset_name_already_exists_warning", [ searchPresetName ])))
				return;

			replacingExisting = true;
		}

		await globals.managers.searchPresetManager.set(searchPresetName, getCurrentSearchSettings());

		const select = document.getElementById("aes_search_presets")
		if(!replacingExisting)
			addPresetOption(select, searchPresetName, true);
		else
			select.value = searchPresetName;
	}

	//
	// Feature
	//

	new Feature("search-presets",
		async function(settings)
		{
			if(!settings.enable_search_presets)
				return;

			const searchPresets = globals.managers.searchPresetManager.all();

			const form = document.getElementById("new_work_search");
			
			// Looking at search results and not the search form
			if(form == undefined)
				return;

			const aesFieldset = document.createElement("fieldset");

			{
				const legend = document.createElement("legend");
				legend.innerText = browser.i18n.getMessage("search_presets");
				
				aesFieldset.append(legend);
			}

			{
				const descriptionList = document.createElement("dl");
				
				{
					const descriptionTerm = document.createElement("dt");

					{
						const label = document.createElement("label");

						label.setAttribute("for", "aes_search_preset");
						label.innerText = browser.i18n.getMessage("search_preset");
						
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
							option.innerText = browser.i18n.getMessage("default");

							select.append(option);
						}

						{
							for(let [searchPresetName, searchPreset] of Object.entries(searchPresets))
							{
								addPresetOption(select, searchPresetName);
							}
						}

						{
							select.addEventListener("change", async function(event)
							{
								if(event.target.value == "")
								{
									setCurrentSearchSettings(defaultSearchSettings);
								}
								else
								{
									const searchPreset = await globals.managers.searchPresetManager.get(event.target.value);
									setCurrentSearchSettings(searchPreset);
								}
							});
						}

						descriptionDetails.append(select);
					}

					descriptionList.append(descriptionDetails);
				}

				aesFieldset.append(descriptionList);
			}

			{
				const controlSet = new ControlSet();

				controlSet.addControl(browser.i18n.getMessage("delete_currently_selected_preset"), undefined, function(event)
				{
					deleteCurrentlySelectedPreset();
				});
				
				controlSet.addControl(browser.i18n.getMessage("save_current_settings_as_preset"), undefined, function(event)
				{
					saveCurrentSettingsAsPreset();
				});

				aesFieldset.append(controlSet.element);
			}

			form.prepend(aesFieldset);
		});
}