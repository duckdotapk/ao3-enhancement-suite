(async function()
{
	let acronym = browser.i18n.getMessage("name_acronym");

	{
		let message = browser.i18n.getMessage("ao3_hide_setting_note", [ browser.i18n.getMessage("name_acronym"), browser.i18n.getMessage("archive_warnings_lc") ]);

		let helpButton = new HelpButton(acronym, message, function(event)
		{
			Modal.alert(message);
		});

		document.querySelector(`label[for="preference_hide_warnings"]`).parentElement.appendChild(helpButton.element);
	}

	{
		let message = browser.i18n.getMessage("ao3_hide_setting_note", [ browser.i18n.getMessage("name_acronym"), browser.i18n.getMessage("additional_tags_lc") ]);

		let helpButton = new HelpButton(acronym, message, function(event)
		{
			Modal.alert(message);
		});

		document.querySelector(`label[for="preference_hide_freeform"]`).parentElement.appendChild(helpButton.element);
	}
})();