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

			let unit = "bytes";
			let bytesInUse = await getLocalStorageSize();
			if(bytesInUse > 1000000)
			{
				unit = "megabytes";
				bytesInUse = bytesInUse / 1000000;
			}
			else if(bytesInUse > 1000)
			{
				unit = "kilobytes";
				bytesInUse = bytesInUse / 1000;
			}

			if(unit != "bytes")
				bytesInUse = bytesInUse.toFixed(1);

			const totalStorageInUse = document.createElement("p");

			// TODO: improve the way this is displayed
			totalStorageInUse.innerText = browser.i18n.getMessage("total_storage_in_use") + ": " + bytesInUse + " " + unit;

			container.appendChild(totalStorageInUse);

			const fileInput = document.createElement("input");
			fileInput.classList.add("aes-hidden");
			fileInput.type = "file";
			fileInput.accept = ".ao3es";

			fileInput.addEventListener("input", async function(event)
			{
				const file = event.target.files[0];

				const errors = [];

				// TODO: more validation steps
				let configuration;
				try
				{
					configuration = JSON.parse(await file.text());

					console.log(typeof(configuration));

					for(let [key, value] of Object.entries(configuration))
						if(!validConfiguationKeys.includes(key))
							errors.push(browser.i18n.getMessage("config_import_invalid_key", [ key ]));
				}
				catch(error)
				{
					errors.push(browser.i18n.getMessage("config_import_failed_to_parse"));
					console.log(error);
				}

				if(errors.length > 0)
				{
					let header = document.createElement("h1");
					header.innerText = browser.i18n.getMessage("configuration_import_failed");

					let paragraph = document.createElement("p");
					paragraph.innerText = browser.i18n.getMessage("configuration_import_failed_desc", [ file.name ]);

					let list = document.createElement("ul");

					for(let error of errors)
					{
						let item = document.createElement("li");
						item.innerText = error;

						list.appendChild(item);
					}

					Modal.close();

					await Modal.show(
					[
						header,
						paragraph,
						list,
					]);
				}
				
				await browser.storage.local.clear();

				await browser.storage.local.set(configuration);
			
				location.reload();
			});

			container.appendChild(fileInput);

			const controlSet = new ControlSet();

			controlSet.addControl(browser.i18n.getMessage("reset_all_data"), browser.i18n.getMessage("reset_all_data_tooltip"), async function(event)
			{
				Modal.close();

				if(await Modal.confirm(browser.i18n.getMessage("reset_all_data_confirmation")))
				{
					await browser.storage.local.clear();
		
					location.reload();
				}
			});

			controlSet.addControl(browser.i18n.getMessage("import_all_data"), browser.i18n.getMessage("import_all_data_tooltip"), async function(event)
			{
				fileInput.click();
			});
	
			// TODO: add tooltip 
			//		Probably modify this function to take a tooltip arg
			controlSet.addControl(browser.i18n.getMessage("export_all_data"), browser.i18n.getMessage("export_all_data_tooltip"), async function(event)
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