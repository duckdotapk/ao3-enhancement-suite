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
	const formatting = await Setting.get("cb_insert_formatting");

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

	if(await Setting.get("cb_focus_after_insert"))
		textarea.focus();

	textarea.dispatchEvent(new Event("input"));
};

(async function()
{
	const settings = await Setting.getAll();

	const commentBox = document.getElementById("add_comment_placeholder");
	if(commentBox == null)
		return;

	commentBox.classList.add("aes-cb");

	const fieldset = commentBox.querySelector("fieldset");
	const heading = fieldset.querySelector("h4.heading");
	const footnote = fieldset.querySelector(".footnote");
	const textarea = fieldset.querySelector("textarea");
	const submit = fieldset.querySelector(".submit.actions > input");

	// Feature: FLoating Comment Box
	const fcbWindow = new FloatingWindow(browser.i18n.getMessage("floating_comment_box"), settings.enable_floating_comment_box, [ "aes-fcb-window" ]);

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

			Setting.get("cb_floating_opacity")
				.then(function (opacity)
				{
					switchToFloatingCommentBox(fcbWindow, commentBox, opacity);
				});

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
			SavedComment.save(pagePath[0] + "_" + textarea.id, textarea.value);
		}, 1000);
	});

	if(settings.save_comments_to_storage)
	{
		let savedComment = await SavedComment.get(pagePath[0] + "_" + textarea.id);

		if(savedComment != undefined)
			textarea.value = savedComment;
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
			if(textarea.value.length == 0 || textarea.value.length > ArchiveConfig.COMMENT_MAX)
			{
				textarea.classList.add("LV_invalid_field");
				return;
			}

			fakeSubmit.value = fakeSubmit.dataset.disableWith;

			await SavedComment.delete(textarea.id);

			submit.click();
		});

		submit.classList.add("aes-hidden");
		submit.parentElement.appendChild(fakeSubmit);
	}

	// Update Settings w/o Page Reload
	browser.storage.onChanged.addListener(function(changes, areaName)
	{
		if(areaName == "local")
		{
			if(changes.settings.oldValue?.enable_floating_comment_box != changes.settings.newValue?.enable_floating_comment_box)
			{
				if(changes.settings.newValue?.enable_floating_comment_box)
					switchToFloatingCommentBox(fcbWindow, commentBox, changes.settings.newValue.cb_floating_opacity);
				else
					switchToStaticCommentBox(fcbWindow, commentBox);
			}

			if(changes.settings.newValue?.enable_floating_comment_box)
				fcbWindow.root.style.opacity = changes.settings.newValue.cb_floating_opacity;

			if(changes.settings.oldValue?.cb_hide_comment_as_heading != changes.settings.newValue?.cb_hide_comment_as_heading)
			{
				if(changes.settings.newValue?.cb_hide_comment_as_heading)
					heading?.classList.add("aes-hidden");
				else
					heading?.classList.remove("aes-hidden");
			}
			
			if(changes.settings.oldValue?.cb_hide_html_footnote != changes.settings.newValue?.cb_hide_html_footnote)
			{
				if(changes.settings.newValue?.cb_hide_html_footnote)
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
		}
	});
})();