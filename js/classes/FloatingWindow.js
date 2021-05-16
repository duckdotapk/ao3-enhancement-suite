class FloatingWindow
{
	static get(id)
	{
		return FloatingWindow.windowsById[id];
	}

	constructor(options)
	{
		// Window IDs
		if(options.id)
		{
			this.id = options.id;
			
			FloatingWindow.windowsById[this.id] = this;
		}

		// Create Window Elements
		const floatingWindow = document.createElement("div");
		floatingWindow.classList.add("aes-floating-window");

		if(options.visible != undefined && !options.visible)
		{
			floatingWindow.visible = false;
			floatingWindow.classList.add("aes-hidden");
		}
		else
		{
			floatingWindow.visible = true;
		}

		if(options.cssClasses != undefined)
			floatingWindow.classList.add(...options.cssClasses);

		document.body.appendChild(floatingWindow);

		this.root = floatingWindow;
		
		// Move this window to the top
		this.moveToTop();
		floatingWindow.addEventListener("click", () => this.moveToTop());

		// Create Window Content
		{
			const floatingWindowHeader = document.createElement("div");
			floatingWindowHeader.classList.add("aes-floating-window-title-bar");
			floatingWindowHeader.innerText = options.title;

			{
				const windowControls = document.createElement("div");
				windowControls.classList.add("aes-floating-window-controls");

				{
					const closeButtonControl = document.createElement("div");
					closeButtonControl.classList.add("aes-floating-window-control");
	
					{
						const closeButton = document.createElement("a");
						closeButton.setAttribute("href", "#");
						closeButton.innerText = "X";
		
						closeButton.addEventListener("click", (event) =>
						{
							event.preventDefault();
		
							this.hide();
						});
	
						closeButtonControl.appendChild(closeButton);
					}

					windowControls.appendChild(closeButtonControl);
				}

				floatingWindowHeader.appendChild(windowControls);

				this.controls = windowControls;
			}
	
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

		// Other Window Options
		if(options.onHide)
			this.onHide = options.onHide;
		
		if(options.onShow)
			this.onShow = options.onShow;

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
			const windowControlRect = this.controls.getBoundingClientRect();

			let minX = -(floatingWindowRect.width) + windowControlRect.width + 30;
			let maxX = window.innerWidth - scrollbarWidth - 30;

			let minY = 0;
			let maxY = window.innerHeight - 30;

			if(this.root.offsetLeft < minX)
				this.root.style.left = minX.toString() + "px";

			if(this.root.offsetTop < minY)
				this.root.style.top = minY.toString() + "px";

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
			let newY = this.root.offsetTop - this.pos2;

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

			if(event.target == this.header)
			{
				event.preventDefault();

				// get the mouse cursor position at startup:
				this.pos3 = event.clientX;
				this.pos4 = event.clientY;
	
				// call a function whenever the cursor moves:
				document.addEventListener("mousemove", mouseMove);
				document.addEventListener("mouseup", mouseUp);
			}
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
		this.visible = false;
		this.root.classList.add("aes-hidden");

		if(this.onHide)
			this.onHide(this);
	}

	show()
	{
		this.visible = true;
		this.root.classList.remove("aes-hidden");

		if(this.onShow)
			this.onShow(this);
	}
}

FloatingWindow.windows = [];
FloatingWindow.windowsById = {};