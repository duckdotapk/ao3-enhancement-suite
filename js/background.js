async function exportAllData(request, sender, sendResponse)
{
	const storage = await browser.storage.local.get();
				
	const storageStr = JSON.stringify(storage, undefined, "	");

	const blob = new Blob([ storageStr ], { type: "application/json" });

	const objectURL = URL.createObjectURL(blob);

	console.log(objectURL);

	browser.downloads.download({ url: objectURL, saveAs: true, filename: browser.i18n.getMessage("name_acronym") + "-data-" + Date.now().toString() + ".ao3es" });
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	switch(request)
	{
		case "export-all-data":
			exportAllData(request, sender, sendResponse);	
			break;

		default:
			break;
	}	
});