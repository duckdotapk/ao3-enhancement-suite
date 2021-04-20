{
	// Copied from https://stackoverflow.com/a/6351386
	//	Except the formatting has been updated to not be disgustingly ugly
	async function roughSizeOfObject(object) 
	{
		const objectList = [];
	
		const recurse = function(value)
		{
			let bytes = 0;
	
			if (typeof(value) === "boolean")
			{
				bytes = 4;
			}
			else if(typeof(value) === "string")
			{
				bytes = value.length * 2;
			}
			else if(typeof(value) === "number")
			{
				bytes = 8;
			}
			else if(typeof value === "object" && objectList.indexOf( value ) === -1)
			{
				objectList[objectList.length] = value;
	
				for(let i in value) 
				{
					bytes += 8; // an assumed existence overhead
					bytes += recurse(value[i])
				}
			}
	
			return bytes;
		}
	
		return recurse(object);
	}

	async function getLocalStorageSize(keys)
	{
		const storage = await browser.storage.local.get(keys);

		const size = await roughSizeOfObject(storage);

		return size;
	}

	async function createManageContainer()
	{
		const container = document.createElement("div");

		try
		{
			const header = document.createElement("h1");
			header.innerText = browser.i18n.getMessage("manage_extension_data");

			container.appendChild(header);

			const description = document.createElement("p");
			description.innerText = browser.i18n.getMessage("manage_extension_data_desc");

			container.appendChild(description);

			const bytesInUse = await getLocalStorageSize(); // await browser.storage.local.getBytesInUse();

			const totalStorageInUse = document.createElement("p");

			// TODO: improve the way this is displayed
			totalStorageInUse.innerText = browser.i18n.getMessage("total_storage_in_use") + ": " + bytesInUse + " bytes";

			container.appendChild(totalStorageInUse);

			const controlSet = new ControlSet();
	
			// TODO: add tooltip browser.i18n.getMessage("export_all_data_tooltip")
			//		Probably modify this function to take a tooltip arg
			controlSet.addControl(browser.i18n.getMessage("export_all_data"), async function(event)
			{
				browser.runtime.sendMessage("export-all-data");				
			});

			container.appendChild(controlSet.element);
		}
		catch(error)
		{
			debugger;
		}

		return container;
	};

	aesDropdown.addItem("manage-extension-data", browser.i18n.getMessage("manage_extension_data"), async function(event, item)
	{
		const manageContainer = await createManageContainer();

		Modal.show(
		[
			manageContainer,
		]);
	});
}