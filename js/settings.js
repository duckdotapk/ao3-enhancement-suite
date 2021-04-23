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
	requiresReload: false,
	defaultValue: false,
});

new Setting(
{
	id: "cb_hide_html_footnote", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_hide_html_footnote"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("cb_hide_html_footnote_tooltip"),
	requiresReload: false,
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
			{ value: "blockquote", text: "Blockquote" },
		],
	},
});

// Hidden Authors & Works
new Setting(
{
	id: "hidden_aw_max_rating", 
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hidden_aw_max_rating"), 
	type: "select", 
	tooltip: browser.i18n.getMessage("hidden_aw_max_rating_tooltip"),
	defaultValue: 3, 
	requiresReload: true,
	extraData:
	{
		options:
		[
			{ value: 0, text: "General Audiences" },
			{ value: 1, text: "Teen And Up Audiences" },
			{ value: 2, text: "Mature" },
			{ value: 3, text: "Explicit (All Works)" },
		],
	},
});

new Setting(
{
	id: "hidden_aw_consider_not_rated_explicit", 
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hidden_aw_consider_not_rated_explicit"), 
	type: "checkbox", 
	tooltip: browser.i18n.getMessage("hidden_aw_consider_not_rated_explicit_tooltip"),
	requiresReload: true,
	defaultValue: true,
});

new Setting(
{
	id: "hidden_aw_quick_hide_key", 
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hidden_aw_quick_hide_key"), 
	type: "select", 
	tooltip: browser.i18n.getMessage("hidden_aw_quick_hide_key_tooltip"),
	defaultValue: "alt", 
	requiresReload: true,
	extraData:
	{
		options:
		[
			{ value: "disabled", text: "Disabled" },
			{ value: "ctrl", text: "Ctrl + Click on Authors/Fandoms/Tags" },
			{ value: "alt", text: "Alt + Click on Authors/Fandoms/Tags" },
		],
	},
});
	
new Setting(
{
	id: "hidden_aw_show_reasons",
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hidden_aw_show_reasons"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("hidden_aw_show_reasons_tooltip"),
	defaultValue: true,
	requiresReload: true,
});

new Setting(
{
	id: "hide_specific_authors",
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hide_specific_authors"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("hide_specific_authors_tooltip"),
	defaultValue: true,
	requiresReload: true,
});

new Setting(
{
	id: "hide_specific_fandoms",
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hide_specific_fandoms"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("hide_specific_fandoms_tooltip"),
	defaultValue: true,
	requiresReload: true,
});

new Setting(
{
	id: "hide_multiple_fandoms",
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hide_multiple_fandoms"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("hide_multiple_fandoms_tooltip"),
	defaultValue: false,
	requiresReload: true,
});

new Setting(
{
	id: "multiple_fandoms_threshold", 
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("multiple_fandoms_threshold"), 
	type: "number", 
	tooltip: browser.i18n.getMessage("multiple_fandoms_threshold_tooltip"),
	defaultValue: 2, 
	requiresReload: true,
	extraData:
	{ 
		min: 2, 
	},
});

new Setting(
{
	id: "hide_specific_tags",
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hide_specific_tags"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("hide_specific_tags_tooltip"),
	defaultValue: true,
	requiresReload: true,
});

new Setting(
{
	id: "hide_own_works",
	category: browser.i18n.getMessage("hidden_authors_and_works"),
	title: browser.i18n.getMessage("hide_own_works"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("hide_own_works_tooltip"),
	defaultValue: false,
	requiresReload: true,
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
	defaultValue: false,
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

new Setting(
{
	id: "show_chapter_word_counts",
	category: browser.i18n.getMessage("work_stats"), 
	title: browser.i18n.getMessage("show_chapter_word_counts"),
	type: "checkbox",
	tooltip: browser.i18n.getMessage("show_chapter_word_counts_tooltip"),
	requiresReload: true,
	experimental: true,
	defaultValue: false,
});