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



	textarea.value += processedSelection.join("\r\n\r\n") + "\r\n\r\n";

	if(await Setting.get("cb_focus_after_insert"))
		textarea.focus();
};

function clipCommentBox(mainElement)
{
	let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // HACK
	let mainElementRect = mainElement.getBoundingClientRect();

	let maxX = window.innerWidth - scrollbarWidth - mainElementRect.width;
	if(maxX < 0)
		maxX = 0;

	let maxY = window.innerHeight - 30;
	if(maxY < 0)
		maxY = 0;

	if(mainElement.offsetLeft > maxX)
		mainElement.style.left = maxX.toString() + "px";

	if(mainElement.offsetTop > maxY)
		mainElement.style.top = maxY.toString() + "px";
}

// Based on this W3 example
//		https://www.w3schools.com/howto/howto_js_draggable.asp
function makeElementDraggable(mainElement, headerElement) 
{
	let pos1 = 0;
	let pos2 = 0;
	let pos3 = 0;
	let pos4 = 0;

	function mouseDown(event) 
	{
		event = event || window.event;
		event.preventDefault();

		// Calculate the ew cursor position
		pos1 = pos3 - event.clientX;
		pos2 = pos4 - event.clientY;
		pos3 = event.clientX;
		pos4 = event.clientY;

		// Set the element's new position
		let newX = mainElement.offsetLeft - pos1;
		if(newX < 0)
			newX = 0;

		let newY = mainElement.offsetTop - pos2;
		if(newY < 0)
			newY = 0;

		mainElement.style.left = newX.toString() + "px";
		mainElement.style.top = newY.toString() + "px";

		clipCommentBox(mainElement);
	}

	function mouseUp() 
	{
		// stop moving when mouse button is released:
		document.removeEventListener("mousemove", mouseDown);
		document.removeEventListener("mouseup", mouseUp);
	}

	function dragMouseDown(e) 
	{
		e = e || window.event;
		e.preventDefault();

		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;

		// call a function whenever the cursor moves:
		document.addEventListener("mousemove", mouseDown);
		document.addEventListener("mouseup", mouseUp);
	}
		
	headerElement.addEventListener("mousedown", dragMouseDown);

	window.addEventListener("resize", function(event)
	{
		clipCommentBox(mainElement);
	});
}

(async function()
{
	const commentBox = document.getElementById("add_comment_placeholder");
	if(commentBox == null)
		return;

	commentBox.classList.add("aes-cb");

	const fieldset = commentBox.querySelector("fieldset");

	if(await Setting.get("enable_floating_comment_box"))
	{
		commentBox.classList.add("aes-fcb");
		commentBox.style = `top: 0px; left: 0px; opacity: ${ await Setting.get("cb_floating_opacity") };`;

		const moveHeader = document.createElement("div");
		moveHeader.classList.add("aes-move-header");
		moveHeader.innerText = browser.i18n.getMessage("fieldset_title", [ browser.i18n.getMessage("name_acronym"), browser.i18n.getMessage("floating_comment_box") ] );
		commentBox.prepend(moveHeader);

		document.body.appendChild(commentBox);
		makeElementDraggable(commentBox, moveHeader);
	}
	else
	{
		let fcbRecommendation = document.createElement("p");
		fcbRecommendation.classList.add("footnote");
		fcbRecommendation.innerText = `(${ browser.i18n.getMessage("cb_recommendation", [ browser.i18n.getMessage("name") ]) })`;
		fieldset.append(fcbRecommendation);
	}

	const heading = fieldset.querySelector("h4.heading");
	if(await Setting.get("cb_hide_comment_as_heading"))
		heading?.classList.add("aes-hidden");

	const footnote = fieldset.querySelector(".footnote");
	if(await Setting.get("cb_hide_html_footnote"))
		footnote.classList.add("aes-hidden");

	const textarea = fieldset.querySelector("textarea");

	if(await Setting.get("cb_enable_additional_controls"))
	{
		const controlSet = new ControlSet();
		controlSet.element.classList.add("aes-cb-actions");
		if(!await Setting.get("cb_hide_html_footnote"))
			controlSet.element.classList.add("aes-footnote-offset");
	
		const insert = controlSet.addControl("Insert Selection", function(event)
		{
			insertSelection(textarea);
		});
	
		insert.title = browser.i18n.getMessage("cb_insert_tooltip");
	
		fieldset.insertBefore(controlSet.element, textarea.parentElement);
	}
})();