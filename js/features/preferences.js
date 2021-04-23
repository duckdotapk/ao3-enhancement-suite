{
	new Feature("preferences", async function(setting)
	{
		const acronym = browser.i18n.getMessage("name_acronym");

		{
			const message = browser.i18n.getMessage("ao3_hide_setting_note", [ browser.i18n.getMessage("name_acronym"), browser.i18n.getMessage("archive_warnings_lc") ]);
	
			const helpButton = new HelpButton(acronym, message, function(event)
			{
				Modal.alert(message);
			});
	
			document.querySelector(`label[for="preference_hide_warnings"]`).parentElement.appendChild(helpButton.element);
		}
	
		{
			const message = browser.i18n.getMessage("ao3_hide_setting_note", [ browser.i18n.getMessage("name_acronym"), browser.i18n.getMessage("additional_tags_lc") ]);
	
			const helpButton = new HelpButton(acronym, message, function(event)
			{
				Modal.alert(message);
			});
	
			document.querySelector(`label[for="preference_hide_freeform"]`).parentElement.appendChild(helpButton.element);
		}
	});
}