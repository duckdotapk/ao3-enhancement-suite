class DeleteButton
{
	constructor(tooltip, onClick)
	{
		let span = document.createElement("span");
		span.classList.add("delete");

		{
			let link = document.createElement("a");
			link.setAttribute("href", "#");
			link.setAttribute("title", tooltip);
			link.innerText = "×";

			link.addEventListener("click", function(event)
			{
				event.preventDefault();
	
				onClick(event);
			});

			span.appendChild(link);
		}

		this.element = span;
	}
}