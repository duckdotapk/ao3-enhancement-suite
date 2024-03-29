// TODO: maybe make this a custom element that extends HTMLUListElement instead of this implementation
class ControlSet
{
	constructor(cssClasses)
	{
		const controlSet = document.createElement("ul");
		controlSet.classList.add("actions");
		controlSet.classList.add("aes-control-set");

		if(cssClasses != undefined)
			for(let cssClass of cssClasses)
				controlSet.classList.add(cssClass);

		this.element = controlSet;
	}

	addControl(controlText, tooltip, onClick)
	{
		const control = document.createElement("li");
	
		if(tooltip != undefined)
			control.title = tooltip;

		{
			const link = document.createElement("a");
	
			link.href = "#";
			link.innerText = controlText;
	
			link.addEventListener("click", function(event)
			{
				event.preventDefault();
	
				onClick(event, link);
			});
	
			control.append(link);
		}
	
		this.element.append(control);

		return control;
	}
}