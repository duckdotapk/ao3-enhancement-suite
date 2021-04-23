(async function()
{
	const settings = await Setting.getAll();

	for(let feature of Feature.instances)
		feature.execute(settings);
})();