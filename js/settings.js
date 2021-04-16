// Floating Comment Box
new Setting("enable_floating_comment_box", browser.i18n.getMessage("floating_comment_box"),	browser.i18n.getMessage("enable"), "checkbox", true);
new Setting("fcb_hide_comment_as_heading", browser.i18n.getMessage("floating_comment_box"), browser.i18n.getMessage("fcb_hide_comment_as_heading"), "checkbox", true);
new Setting("fcb_hide_html_footnote", browser.i18n.getMessage("floating_comment_box"), browser.i18n.getMessage("fcb_hide_html_footnote"), "checkbox", true);
new Setting("fcb_focus_after_insert", browser.i18n.getMessage("floating_comment_box"), browser.i18n.getMessage("fcb_focus_after_insert"), "checkbox", true);

// Search Presets
new Setting("enable_search_presets", browser.i18n.getMessage("search_presets"),	browser.i18n.getMessage("enable"), "checkbox", true);

// Tag Collapse
new Setting("enable_tag_collapse", browser.i18n.getMessage("tag_collapse"),	browser.i18n.getMessage("enable"), "checkbox", true);
new Setting("tag_collapse_threshold", browser.i18n.getMessage("tag_collapse"),	browser.i18n.getMessage("threshold"), "number", 20, { min: 0 });
 
// Work Stats
new Setting("enable_average_words_per_chapter_stat", browser.i18n.getMessage("work_stats"), browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("average_words_per_chapter") ]),	"checkbox",	true);
new Setting("enable_estimated_reading_time_stat", browser.i18n.getMessage("work_stats"), browser.i18n.getMessage("enable_titled", [ browser.i18n.getMessage("estimated_reading_time") ]), "checkbox", true);
new Setting("read_speed", browser.i18n.getMessage("work_stats"), browser.i18n.getMessage("reading_speed"), "number", 200, { min: 1 });