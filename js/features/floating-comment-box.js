async function insertSelection(textarea)
{
	let rawSelection = window.getSelection().toString().split("\r\n");

	let processedSelection = [];

	for(let line of rawSelection)
	{
		if(line == "")
			continue;

		processedSelection.push(`<b>${ line }</b>`);
	}

	textarea.value += processedSelection.join("\r\n\r\n") + "\r\n\r\n";

	if(await Setting.get("fcb_focus_after_insert"))
		textarea.focus();
};

// Based on this W3 example
//		https://www.w3schools.com/howto/howto_js_draggable.asp
function makeElementDraggable(mainElement, headerElement) 
{
	let pos1 = 0;
	let pos2 = 0;
	let pos3 = 0;
	let pos4 = 0;

	function mouseDown(e) 
	{
		e = e || window.event;
		e.preventDefault();

		// Calculate the ew cursor position
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		// Set the element's new position
		let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // HACK
		let mainElementRect = mainElement.getBoundingClientRect();

		let maxX = window.innerWidth - scrollbarWidth - mainElementRect.width;

		let maxY = window.innerHeight - mainElementRect.height;

		let newX = mainElement.offsetLeft - pos1;

		if(newX < 0)
			newX = 0;
		else if(newX > maxX)
			newX = maxX;

		let newY = mainElement.offsetTop - pos2;

		if(newY < 0)
			newY = 0;
		else if(newY > maxY)
			newY = maxY;

		mainElement.style.left = newX.toString() + "px";
		mainElement.style.top = newY.toString() + "px";
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
}

(async function()
{
	//
	// Get User Settings
	//

	if(!await Setting.get("enable_floating_comment_box"))
		return;

	//
	// Feature
	//

	const commentBox = document.getElementById("add_comment_placeholder");
	commentBox.classList.add("aes-fcb");
	commentBox.style = "top: 0px; left: 0px; opacity: 100%;";

	const moveHeader = document.createElement("div");
	moveHeader.classList.add("aes-move-header");
	moveHeader.innerText = browser.i18n.getMessage("fieldset_title", [ browser.i18n.getMessage("name_acronym"), browser.i18n.getMessage("floating_comment_box") ] );

	commentBox.prepend(moveHeader);

	const fieldset = commentBox.querySelector("fieldset");

	const heading = fieldset.querySelector("h4.heading");
	if(await Setting.get("fcb_hide_comment_as_heading"))
		heading.classList.add("aes-hidden");

	const footnote = fieldset.querySelector(".footnote");
	if(await Setting.get("fcb_hide_html_footnote"))
		footnote.classList.add("aes-hidden");

	const textarea = fieldset.querySelector("textarea");

	const controlSet = new ControlSet();
	controlSet.element.classList.add("aes-fcb-actions");
	if(!await Setting.get("fcb_hide_html_footnote"))
		controlSet.element.classList.add("aes-footnote-offset");

	const insert = controlSet.addControl("Insert", function(event)
	{
		insertSelection(textarea);
	});

	insert.title = "Inserts your current selection.\n\nYou can customise the default style of the inserted text in the AES settings.";

	fieldset.insertBefore(controlSet.element, textarea.parentElement);

	document.body.appendChild(commentBox);
	makeElementDraggable(commentBox, moveHeader);
})();