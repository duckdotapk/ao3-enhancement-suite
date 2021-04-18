class HelpButton
{
	constructor(text, tooltip, onClick)
	{
		let link = document.createElement("a");
		link.classList.add("help");
		link.classList.add("symbol");
		link.classList.add("question");
		link.setAttribute("href", "#");
		link.setAttribute("title", tooltip);

		link.addEventListener("click", function(event)
		{
			event.preventDefault();

			onClick(event);
		});

		{
			let span = document.createElement("span");
			span.classList.add("symbol");
			span.classList.add("question");

			link.appendChild(span);

			{
				let span2 = document.createElement("span");
				span2.innerText = text;

				span.appendChild(span2);
			}
		}

		this.element = link;
	}
}