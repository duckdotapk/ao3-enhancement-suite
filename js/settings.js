new Setting("enable_search_presets", 					browser.i18n.getMessage("search_presets"),	browser.i18n.getMessage("enable"), 						"checkbox", 	true);

new Setting("enable_tag_collapse",						browser.i18n.getMessage("tag_collapse"),	browser.i18n.getMessage("enable"),						"checkbox",		true);
new Setting("tag_collapse_threshold",					browser.i18n.getMessage("tag_collapse"),	browser.i18n.getMessage("threshold"),					"number",		20,		{ min: 0 });

new Setting("enable_average_words_per_chapter_stat", 	browser.i18n.getMessage("work_stats"),		browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("average_words_per_chapter") ]),		"checkbox",		true);
new Setting("enable_estimated_reading_time_stat",		browser.i18n.getMessage("work_stats"),		browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("estimated_reading_time") ]),		"checkbox",		true);
new Setting("read_speed",								browser.i18n.getMessage("work_stats"),		browser.i18n.getMessage("reading_speed"),																"number",		200,	{ min: 1 });