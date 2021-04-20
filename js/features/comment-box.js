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
	let rawSelection = window.getSelection().toString().split("\r\n");

	let processedSelection = [];

	for(let line of rawSelection)
	{
		if(line == "")
			continue;

		switch(await Setting.get("cb_insert_formatting"))
		{
			case "bold":
				processedSelection.push(`<b>${ line }</b>`);
				break;

			case "italics":
				processedSelection.push(`<i>${ line }</i>`);
				break;

			case "none":
			default:
				processedSelection.push(line);
		}
	}

	if(processedSelection.length == 0)
		return;

	textarea.value += processedSelection.join("\r\n\r\n") + "\r\n\r\n";

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

	const fcbWindow = new FloatingWindow(browser.i18n.getMessage("floating_comment_box"), settings.enable_floating_comment_box, [ "aes-fcb-window" ]);

	if(settings.enable_floating_comment_box)
		switchToFloatingCommentBox(fcbWindow, commentBox, settings.cb_floating_opacity);

	const fieldset = commentBox.querySelector("fieldset");
	
	let fcbRecommendation = document.createElement("p");
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

	fieldset.append(fcbRecommendation);

	const heading = fieldset.querySelector("h4.heading");
	if(settings.cb_hide_comment_as_heading)
		heading?.classList.add("aes-hidden");

	const footnote = fieldset.querySelector(".footnote");
	if(settings.cb_hide_html_footnote)
		footnote.classList.add("aes-hidden");

	const textarea = fieldset.querySelector("textarea");

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
			let workId = "work_" + textarea.id.substr(20);

			let storage =
			{
				savedComments: {},
			}

			storage.savedComments[workId] = textarea.value;

			browser.storage.local.set(storage);
		}, 1000);
	});

	if(settings.save_comments_to_storage)
	{
		let savedComments = (await browser.storage.local.get("savedComments"))?.savedComments;
		if(savedComments == undefined)
			savedComments = {};

		let workId = textarea.id.substr(20);

		let savedComment = savedComments["work_" + workId];

		if(savedComment != undefined)
			textarea.value = savedComment;
	}

	let controlSet;
	if(settings.cb_enable_additional_controls)
	{
		controlSet = new ControlSet();
		controlSet.element.classList.add("aes-cb-actions");
		if(!settings.cb_hide_html_footnote)
			controlSet.element.classList.add("aes-footnote-offset");
	
		const insert = controlSet.addControl("Insert Selection", function(event)
		{
			insertSelection(textarea);
		});
	
		insert.title = browser.i18n.getMessage("cb_insert_tooltip");
	
		fieldset.insertBefore(controlSet.element, textarea.parentElement);
	}

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
				commentBox.style.opacity = changes.settings.newValue.cb_floating_opacity;

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