

{
	//
	// Variables & Util Functions
	//

	let commentBox;
		
	let fieldset;
	let heading;
	let footnote;
	let textarea;
	let submit;

	let fcbWindow;

	function switchToFloatingCommentBox(fcbWindow, commentBox, opacity)
	{
		fcbWindow.show();
		fcbWindow.contentWrapper.appendChild(commentBox);
		fcbWindow.root.style.opacity = opacity;
	}
	
	function switchToStaticCommentBox(fcbWindow, commentBox)
	{
		fcbWindow.hide();
		document.getElementById("feedback").insertBefore(commentBox, document.getElementById("comments_placeholder"));
	}
	
	async function insertSelection(textarea)
	{
		const settings = await Setting.getAll();

		const formatting = settings.cb_insert_formatting;
	
		const joiner = formatting == "blockquote" ? "\r\n" : "\r\n\r\n";
	
		let rawSelection = window.getSelection().toString().split("\r\n");
	
		let processedSelection = [];
	
		for(let line of rawSelection)
		{
			if(line == "")
				continue;
	
			switch(formatting)
			{
				case "bold":
					processedSelection.push(`<b>${ line }</b>`);
					break;
	
				case "italics":
					processedSelection.push(`<i>${ line }</i>`);
					break;
	
				case "blockquote":
					processedSelection.push(`\t<p>${ line }</p>`);
					break;
	
				case "none":
				default:
					processedSelection.push(line);
			}
		}
	
		if(processedSelection.length == 0)
			return;
	
		let text = processedSelection.join(joiner);
	
		if(formatting == "blockquote");
			text = "<blockquote>\r\n" + text + "\r\n</blockquote>";
	
		textarea.value += text + "\r\n\r\n";
	
		if(settings.cb_focus_after_insert)
			textarea.focus();
	
		textarea.dispatchEvent(new Event("input"));
	};

	//
	// Feature
	//

	new Feature("comment-box", 
		async function(settings)
		{
			commentBox = document.getElementById("add_comment_placeholder");
			if(commentBox == null)
				return;
		
			commentBox.classList.add("aes-cb");
		
			fieldset = commentBox.querySelector("fieldset");
			heading = fieldset.querySelector("h4.heading");
			footnote = fieldset.querySelector(".footnote");
			textarea = fieldset.querySelector("textarea");
			submit = fieldset.querySelector(".submit.actions > input");
		
			// Feature: FLoating Comment Box
			fcbWindow = new FloatingWindow(
				{
					title: browser.i18n.getMessage("floating_comment_box"), 
					visible: settings.enable_floating_comment_box, 
					cssClasses: 
					[ 
						"aes-fcb-window" 
					],
					onHide: function(window)
					{			
						Setting.set("enable_floating_comment_box", false);
					},
				});
		
			if(settings.enable_floating_comment_box)
				switchToFloatingCommentBox(fcbWindow, commentBox, settings.cb_floating_opacity);
			
			const fcbRecommendation = document.createElement("p");
			fcbRecommendation.classList.add("footnote");
			fcbRecommendation.classList.add("aes-fcb-recommendation");
			
			{
				fcbRecommendation.appendChild(document.createTextNode("("));
		
				const link = document.createElement("a");
				link.innerText = browser.i18n.getMessage("cb_recommendation");
		
				link.addEventListener("click", function(event)
				{
					event.preventDefault();
		
					Setting.set("enable_floating_comment_box", true);
				});
		
				fcbRecommendation.appendChild(link);
		
				fcbRecommendation.appendChild(document.createTextNode(")"));
			}
		
			fieldset.appendChild(fcbRecommendation);
		
			// Feature: Hide "Comment as <pseud>" heading
			if(settings.cb_hide_comment_as_heading)
				heading?.classList.add("aes-hidden");
		
			// Feature Hide "Plain text with limited HTML" footnote
			if(settings.cb_hide_html_footnote)
				footnote.classList.add("aes-hidden");
		
			// Feature: Additional Controls
			let controlSet;
			if(settings.cb_enable_additional_controls)
			{
				controlSet = new ControlSet();
				controlSet.element.classList.add("aes-cb-actions");
				if(!settings.cb_hide_html_footnote)
					controlSet.element.classList.add("aes-footnote-offset");
			
				// TODO: tooltip
				const insert = controlSet.addControl("Insert Selection", undefined, function(event)
				{
					insertSelection(textarea);
				});
			
				insert.title = browser.i18n.getMessage("cb_insert_tooltip");
			
				fieldset.insertBefore(controlSet.element, textarea.parentElement);
			}
		
			// Feature: Autosave Comments
			textarea.dataset.saveId = textarea.id.substr(20);
		
			let timeout;
			textarea.addEventListener("input", async function(event)
			{
				// Not using "settings" here so the setting can be changed without reloading the page
				if(!await Setting.get("save_comments_to_storage")) 
					return;
		
				if(timeout != undefined)
					clearTimeout(timeout);
		
				timeout = setTimeout(function()
				{
					const url = new URL(window.location);

					const savedComment = {};

					savedComment.url = url.pathname + url.search;

					if(globals.pagePath[0] == "works")
					{
						savedComment.work = 
						{
							id: globals.pagePath[1],
							title: document.getElementById("workskin").querySelector(".title.heading").innerText,
							authors: [],
						};

						savedComment.work.authors = [];

						for(let author of document.getElementById("workskin").querySelector(".byline.heading").querySelectorAll("a"))
						{
							savedComment.work.authors.push(
								{
									name: author.innerText,
									url: author.getAttribute("href"),
								});
						}

						if(globals.pagePath[2] == "chapters")
						{
							savedComment.work.chapter = 
							{
								id: globals.pagePath[3],
								title: document.querySelector(".chapter.preface.group").querySelector(".title").innerText,
							};
						}
					}
					else if(globals.pagePath[0] == "admin_posts")
					{
						savedComment.adminPost =
						{
							id: globals.pagePath[1],
							title: document.querySelector(".news.module.group").querySelector(".heading").innerText,
						}
					}

					savedComment.value = textarea.value;

					globals.managers.savedCommentManager.set(globals.pagePath[0] + "_" + textarea.id, savedComment);
				}, 1000);
			});
		
			if(settings.save_comments_to_storage)
			{
				let savedComment = await globals.managers.savedCommentManager.get(globals.pagePath[0] + "_" + textarea.id);
		
				if(savedComment != undefined)
				{
					// Check for older versions where savedComment would just be the content of the comment
					textarea.value = savedComment.value != undefined ? savedComment.value : savedComment;
				}
			}
		
			{
				// Add a fake submit button so we can do stuff when it's clicked before triggering the real one
				//	This is awesome and a little disgusting lol
				const fakeSubmit = submit.cloneNode();
				fakeSubmit.classList.add("aes-fake-submit");
				fakeSubmit.removeAttribute("id");
				fakeSubmit.removeAttribute("name");
				fakeSubmit.setAttribute("type", "button");
		
				fakeSubmit.addEventListener("click", async function(event)
				{
					if(textarea.value.length == 0 || textarea.value.length > globals.ArchiveConfig.COMMENT_MAX)
					{
						textarea.classList.add("LV_invalid_field");
						return;
					}
		
					fakeSubmit.value = fakeSubmit.dataset.disableWith;
		
					await globals.managers.savedCommentManager.delete(textarea.id);
		
					submit.click();
				});
		
				submit.classList.add("aes-hidden");
				submit.parentElement.appendChild(fakeSubmit);
			}
		},
		async function(settings, changedSettings)
		{
			if(commentBox == null)
				return;

			if(changedSettings.enable_floating_comment_box)
			{
				if(settings.enable_floating_comment_box)
					switchToFloatingCommentBox(fcbWindow, commentBox, settings.cb_floating_opacity);
				else
					switchToStaticCommentBox(fcbWindow, commentBox);
			}

			if(changedSettings.cb_floating_opacity)
				fcbWindow.root.style.opacity = settings.cb_floating_opacity;
			
			if(changedSettings.cb_hide_comment_as_heading)
			{
				if(settings.cb_hide_comment_as_heading)
					heading?.classList.add("aes-hidden");
				else
					heading?.classList.remove("aes-hidden");
			}
			
			if(changedSettings.cb_hide_html_footnote)
			{
				if(settings.cb_hide_html_footnote)
				{
					footnote?.classList.add("aes-hidden");
					controlSet?.element.classList.remove("aes-footnote-offset");
				}
				else
				{
					footnote?.classList.remove("aes-hidden");
					controlSet?.element.classList.add("aes-footnote-offset");
				}
			}			
		});
}