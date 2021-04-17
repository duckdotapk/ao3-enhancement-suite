// Enhanced Comment Box
new Setting(
{
	id: "save_comments_to_storage",
	category: browser.i18n.getMessage("comment_box"),
	title: browser.i18n.getMessage("save_comments_to_storage"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("save_comments_to_storage_tooltip"),
	defaultValue: true,
});

new Setting(
{
	id: "enable_floating_comment_box",
	category: browser.i18n.getMessage("comment_box"),
	title: browser.i18n.getMessage("enable_titled_nq", [ browser.i18n.getMessage("floating_comment_box") ]),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("enable_floating_comment_box_toolip"),
	requiresReload: false,
	defaultValue: false,
});

new Setting(
{
	id: "cb_floating_opacity",
	category: browser.i18n.getMessage("comment_box"),
	title: browser.i18n.getMessage("cb_floating_opacity"),
	type: "number",
	tooltip: browser.i18n.getMessage("cb_floating_opacity_tooltip"),
	requiresReload: false,
	defaultValue: 0.65,
	extraData:
	{
		min: 0.1,
		max: 1,
		step: 0.01,
	},
});

new Setting(
{
	id: "cb_hide_comment_as_heading", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_hide_comment_as_heading"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("cb_hide_comment_as_heading_tooltip"),
	requiresReload: true,
	defaultValue: false,
});

new Setting(
{
	id: "cb_hide_html_footnote", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_hide_html_footnote"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("cb_hide_html_footnote_tooltip"),
	requiresReload: true,
	defaultValue: false,
});

new Setting(
{
	id: "cb_enable_additional_controls", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("enable_titled_nq", [ browser.i18n.getMessage("additional_controls") ]), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("cb_enable_additional_controls_tooltip"),
	requiresReload: true,
	defaultValue: true,
});

new Setting(
{
	id: "cb_focus_after_insert", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_focus_after_insert"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("cb_focus_after_insert_tooltip", [ browser.i18n.getMessage("insert_selection_button_explanation") ]),
	requiresReload: false,
	defaultValue: true,
});

new Setting(
{
	id: "cb_insert_formatting", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_insert_formatting"), 
	type: "select", 
	tooltip: browser.i18n.getMessage("cb_insert_formatting_tooltip", [ browser.i18n.getMessage("insert_selection_button_explanation") ]),
	defaultValue: "bold", 
	requiresReload: false,
	extraData:
	{
		options:
		[
			{ value: "none", text: "None" },
			{ value: "bold", text: "Bold" },
			{ value: "italics", text: "Italics" },
		],
	},
});

// Search Presets
new Setting(
{
	id: "enable_search_presets", 
	category: browser.i18n.getMessage("search_presets"),	
	title: browser.i18n.getMessage("enable"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("enable_search_presets_tooltip"),
	requiresReload: true,
	defaultValue: true,
});

// Tag Collapse
new Setting(
{
	id: "enable_tag_collapse", 
	category: browser.i18n.getMessage("tag_collapse"),	
	title: browser.i18n.getMessage("enable"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("enable_tag_collapse_tooltip"),
	requiresReload: true,
	defaultValue: true,
});
new Setting(
{
	id: "tag_collapse_threshold", 
	category: browser.i18n.getMessage("tag_collapse"),	
	title: browser.i18n.getMessage("threshold"), 
	type: "number", 
	tooltip: browser.i18n.getMessage("tag_collapse_threshold_tooltip"),
	requiresReload: true,
	defaultValue: 20, 
	extraData:
	{ 
		min: 0, 
	},
});
 
// Work Stats
new Setting(
{
	id: "enable_average_words_per_chapter_stat", 
	category: browser.i18n.getMessage("work_stats"), 
	title: browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("average_words_per_chapter") ]),	
	type: "checkbox",	
	tooltip: browser.i18n.getMessage("enable_average_words_per_chapter_stat_tooltip"),
	requiresReload: true,
	defaultValue: true,
});

new Setting(
{
	id: "enable_estimated_reading_time_stat", 
	category: browser.i18n.getMessage("work_stats"), 
	title: browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("estimated_reading_time") ]), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("enable_estimated_reading_time_stat_tooltip"),
	requiresReload: true,
	defaultValue: true,
});

new Setting(
{
	id: "read_speed", 
	category: browser.i18n.getMessage("work_stats"), 
	title: browser.i18n.getMessage("reading_speed"), 
	type: "number", 
	tooltip: browser.i18n.getMessage("read_speed_tooltip"),
	requiresReload: true,
	defaultValue: 200, 
	extraData:
	{
		min: 1,
	},
});