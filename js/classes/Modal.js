function addBodyCloseEvent(resolve, args)
{
	function handler(event)
	{
		if(event.target.classList.contains("modal-closer"))
		{
			Modal.close();

			resolve(args);

			document.body.removeEventListener("click", handler);
		}	
	}

	document.body.addEventListener("click", handler);
}

class Modal
{
	static show(contentElements, hideCloseButton)
	{
		while(Modal.body.firstChild)
			Modal.body.removeChild(Modal.body.firstChild);

		let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // HACK

		document.body.style = `margin-right: ${ scrollbarWidth }px; overflow: hidden; height: ${ window.innerHeight }px;`;

		Modal.background.style.display = "block";
		Modal.background.querySelector(".loading").style.display = "none";

		Modal.wrap.style.display = "block";
		Modal.wrap.style.top = `${ window.scrollY.toString() }px`;

		Modal.body.classList.remove("userstuff");
		Modal.body.classList.add("aes-modal");

		for(let contentElement of contentElements)
			Modal.body.append(contentElement);

		Modal.footer.querySelector(".title").innerText = browser.i18n.getMessage("name");

		if(hideCloseButton)
			Modal.closeButton.classList.add("aes-hidden");

		// Forces the Modal to get resized, AO3 is listening for this event
		//	https://github.com/otwcode/otwarchive/blob/1f7610f25b28388bd6b2beb4715f2a80ece78ef7/public/javascripts/ao3modal.js#L242
		window.dispatchEvent(new Event("resize"));
	}

	static close()
	{
		document.body.style = "";

		Modal.background.style.display = "none";

		Modal.wrap.style.display = "none";

		Modal.body.classList.add("userstuff");
		Modal.body.classList.remove("aes-modal");

		Modal.closeButton.classList.remove("aes-hidden");
	}

	static async alert(message)
	{
		return new Promise((resolve) =>
			{
				let header = document.createElement("h4");
				header.innerText = message;

				let controlSet = new ControlSet();

				controlSet.addControl(browser.i18n.getMessage("confirm"), function()
				{
					Modal.close();

					resolve();
				});

				addBodyCloseEvent(resolve);

				Modal.show(
				[ 
					header,
					controlSet.element 
				], true);
			});
	}

	static async confirm(message)
	{
		return new Promise((resolve) =>
			{
				let header = document.createElement("h4");
				header.innerText = message;

				let controlSet = new ControlSet();

				controlSet.addControl(browser.i18n.getMessage("confirm"), function()
				{
					Modal.close();

					resolve(true);
				});

				controlSet.addControl(browser.i18n.getMessage("cancel"), function()
				{
					Modal.close();

					resolve(false);
				});

				addBodyCloseEvent(resolve, { action: "cancel" });

				Modal.show( 
				[ 
					header,
					controlSet.element 
				], true);
			});
	}

	static async prompt(message, defaultValue, options)
	{
		return new Promise((resolve) =>
			{
				let header = document.createElement("h4");
				header.innerText = message;
		
				let input = document.createElement("input");
				input.type = "text";
				input.value = defaultValue != undefined ? defaultValue : "";
		
				if(options.minlength != undefined)
					input.minlength = options.minlength;
		
				let controlSet = new ControlSet();
		
				controlSet.addControl(browser.i18n.getMessage("confirm"), function()
				{
					resolve(input.value);
		
					Modal.close();
				});
		
				controlSet.addControl(browser.i18n.getMessage("cancel"), function()
				{
					resolve(null);
		
					Modal.close();
				});

				addBodyCloseEvent(resolve, null);
		
				Modal.show( 
				[ 
					header,
					input,
					controlSet.element 
				], true);
			});
	}
}

Modal.background = document.getElementById("modal-bg");

Modal.wrap = document.getElementById("modal-wrap");
Modal.body = Modal.wrap.querySelector(".content.userstuff");
Modal.footer = Modal.wrap.querySelector(".footer");
Modal.closeButton = Modal.wrap.querySelector(".modal-closer");