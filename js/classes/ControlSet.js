class ControlSet
{
	constructor(parentElement)
	{
		const controlSet = document.createElement("ul");
		controlSet.classList.add("actions");

		this.controlSet = controlSet;

		parentElement.append(this.controlSet);
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
	
		this.controlSet.append(control);
	}
}