class NavDropdown
{
	constructor(name)
	{
		const container = document.createElement("li");
		container.classList.add("dropdown");
		container.setAttribute("aria-haspopup", true);

		NavDropdown.navbar.appendChild(container);

		this.container = container;

		{
			const toggle = document.createElement("a");
			toggle.classList.add("dropdown-toggle");
			toggle.setAttribute("href", "#");
			toggle.dataset.toggle = "dropdown";
			toggle.dataset.target = "#";
			toggle.innerText = name;

			container.appendChild(toggle);

			this.toggle = toggle;

			const dropdown = document.createElement("ul");
			dropdown.classList.add("menu");
			dropdown.classList.add("dropdown-menu");
			dropdown.setAttribute("role", "menu");

			container.appendChild(dropdown);

			this.dropdown = dropdown;
		}
	}

	addItem(text, onClick)
	{
		const item = document.createElement("li");
		item.setAttribute("role", "menu-item");

		this.dropdown.appendChild(item);

		{
			const link = document.createElement("a");
			link.setAttribute("href", "#");
			link.innerText = text;

			link.addEventListener("click", function(event)
			{
				event.preventDefault();

				onClick(event, item);
			});

			item.appendChild(link);
		}

		return item;
	}
}

NavDropdown.navbar = document.querySelector(".primary.navigation.actions");