// Enhanced Comment Box
new Setting(
{
	id: "enable_floating_comment_box",
	category: browser.i18n.getMessage("comment_box"),
	title: browser.i18n.getMessage("enable_titled_nq", [ browser.i18n.getMessage("floating_comment_box") ]),
	type: "checkbox",
	defaultvalue: true,
});

new Setting(
{
	id: "cb_hide_comment_as_heading", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_hide_comment_as_heading"), 
	type: "checkbox", 
	defaultvalue: true,
});

new Setting(
{
	id: "cb_hide_html_footnote", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_hide_html_footnote"), 
	type: "checkbox", 
	defaultvalue: true,
});

new Setting(
{
	id: "cb_enable_additional_controls", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("enable_titled_nq", [ browser.i18n.getMessage("additional_controls") ]), 
	type: "checkbox", 
	defaultvalue: true,
});

new Setting(
{
	id: "cb_focus_after_insert", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_focus_after_insert"), 
	type: "checkbox", 
	defaultvalue: true,
});
new Setting(
{
	id: "cb_insert_formatting", 
	category: browser.i18n.getMessage("comment_box"), 
	title: browser.i18n.getMessage("cb_insert_formatting"), 
	type: "select", 
	defaultvalue: "bold", 
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
	defaultvalue: true,
});

// Tag Collapse
new Setting(
{
	id: "enable_tag_collapse", 
	category: browser.i18n.getMessage("tag_collapse"),	
	title: browser.i18n.getMessage("enable"), 
	type: "checkbox", 
	defaultvalue: true,
});
new Setting(
{
	id: "tag_collapse_threshold", 
	category: browser.i18n.getMessage("tag_collapse"),	
	title: browser.i18n.getMessage("threshold"), 
	type: "number", 
	defaultvalue: 20, 
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
	defaultvalue: true,
});

new Setting(
{
	id: "enable_estimated_reading_time_stat", 
	category: browser.i18n.getMessage("work_stats"), 
	title: browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("estimated_reading_time") ]), 
	type: "checkbox", 
	defaultvalue: true,
});

new Setting(
{
	id: "read_speed", 
	category: browser.i18n.getMessage("work_stats"), 
	title: browser.i18n.getMessage("reading_speed"), 
	type: "number", 
	defaultvalue: 200, 
	extraData:
	{
		min: 1,
	},
});