new Setting("enable_search_presets", 					"Search Presets",	"Enable", 								"checkbox", 	true);

new Setting("enable_tag_collapse",						"Tag Collapse",		"Enable",								"checkbox",		true);
new Setting("tag_collapse_threshold",					"Tag Collapse",		"Threshold",							"number",		20,		{ min: 0 });

new Setting("enable_average_words_per_chapter_stat", 	"Work Stats",		`Enable "Average words per chapter"`,	"checkbox",		true);
new Setting("enable_estimated_reading_time_stat",		"Work Stats",		`Enable "Estimated reading time"`,		"checkbox",		true);
new Setting("read_speed",								"Work Stats",		`Reading speed (wpm)`,						"number",		200,	{ min: 1 });