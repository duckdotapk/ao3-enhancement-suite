// TODO: maybe make this a custom element that extends HTMLUListElement instead of this implementation
class ControlSet
{
	constructor()
	{
		const controlSet = document.createElement("ul");
		controlSet.classList.add("actions");

		this.element = controlSet;
	}

	addControl(controlText, onClick)
	{
		const control = document.createElement("li");
	
		{
			const link = document.createElement("a");
	
			link.href = "#";
			link.innerText = controlText;
	
			link.addEventListener("click", function(event)
			{
				event.preventDefault();
	
				onClick(event);
			});
	
			control.append(link);
		}
	
		this.element.append(control);

		return control;
	}
}