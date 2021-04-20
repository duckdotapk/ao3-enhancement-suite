class FloatingWindow
{
	constructor(title, visible, cssClasses)
	{
		// Create Window Elements
		const floatingWindow = document.createElement("div");
		floatingWindow.classList.add("aes-floating-window");

		if(visible != undefined && !visible)
			floatingWindow.classList.add("aes-hidden");

		if(cssClasses != undefined)
			floatingWindow.classList.add(...cssClasses);

		document.body.appendChild(floatingWindow);

		this.root = floatingWindow;
		
		// Move this window to the top
		this.moveToTop();
		floatingWindow.addEventListener("click", () => this.moveToTop());

		// Create Window Content
		{
			const floatingWindowHeader = document.createElement("div");
			floatingWindowHeader.classList.add("aes-floating-window-title-bar");
			floatingWindowHeader.innerText = title;
	
			floatingWindow.appendChild(floatingWindowHeader);

			this.header = floatingWindowHeader;
	
			const floatingWindowContentWrapper = document.createElement("div");
			floatingWindowContentWrapper.classList.add("aes-floating-window-content");

			floatingWindow.appendChild(floatingWindowContentWrapper);

			this.contentWrapper = floatingWindowContentWrapper;
		}

		// Make Window Draggable
		this.pos1 = 0;
		this.pos2 = 0;
		this.pos3 = 0;
		this.pos4 = 0;

		this.makeDraggable();

		FloatingWindow.windows.push(this);
	}

	// Based on this W3 example
	//		https://www.w3schools.com/howto/howto_js_draggable.asp
	makeDraggable()
	{
		const clipPosition = () =>
		{
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // HACK
			const floatingWindowRect = this.root.getBoundingClientRect();

			let maxX = window.innerWidth - scrollbarWidth - floatingWindowRect.width;
			if(maxX < 0)
				maxX = 0;

			let maxY = window.innerHeight - 30;
			if(maxY < 0)
				maxY = 0;

			if(this.root.offsetLeft > maxX)
				this.root.style.left = maxX.toString() + "px";

			if(this.root.offsetTop > maxY)
				this.root.style.top = maxY.toString() + "px";
		}

		const mouseMove = (event) =>
		{
			event = event || window.event;
			event.preventDefault();

			// Calculate the new cursor position
			this.pos1 = this.pos3 - event.clientX;
			this.pos2 = this.pos4 - event.clientY;
			this.pos3 = event.clientX;
			this.pos4 = event.clientY;

			// Set the element's new position
			let newX = this.root.offsetLeft - this.pos1;
			if(newX < 0)
				newX = 0;

			let newY = this.root.offsetTop - this.pos2;
			if(newY < 0)
				newY = 0;

			this.root.style.left = newX.toString() + "px";
			this.root.style.top = newY.toString() + "px";

			clipPosition();
		}

		const mouseUp = (event) =>
		{
			// stop moving when mouse button is released:
			document.removeEventListener("mousemove", mouseMove);
			document.removeEventListener("mouseup", mouseUp);
		}

		const mouseDown = (event) =>
		{
			this.moveToTop();

			event = event || window.event;
			event.preventDefault();

			// get the mouse cursor position at startup:
			this.pos3 = event.clientX;
			this.pos4 = event.clientY;

			// call a function whenever the cursor moves:
			document.addEventListener("mousemove", mouseMove);
			document.addEventListener("mouseup", mouseUp);
		}

		this.header.addEventListener("mousedown", mouseDown);

		window.addEventListener("resize", clipPosition);
	}

	moveToTop()
	{
		let currentZIndex = parseInt(this.root.style.zIndex);

		if(isNaN(currentZIndex))
			currentZIndex = 1000;

		if(FloatingWindow.windows.length > 0)
		{
			for(let window of FloatingWindow.windows)
			{
				if(window == this)
					continue;
	
				const ZIndex = parseInt(window.root.style.zIndex);
	
				if(ZIndex >= currentZIndex)
					currentZIndex = ZIndex + 1;
			}
		}

		// HACK: Make sure AO3 modals are ALWAYS on top of the highest window
		Modal.background.style.zIndex = currentZIndex + 1;
		Modal.wrap.style.zIndex = currentZIndex + 2;

		this.root.style.zIndex = currentZIndex;
	}

	hide()
	{
		this.root.classList.add("aes-hidden");
	}

	show()
	{
		this.root.classList.remove("aes-hidden");
	}
}

FloatingWindow.windows = [];