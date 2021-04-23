class Feature
{
	constructor(id, main)
	{
		this.id = id;
		this.main = main;

		Feature.instances.push(this);
	}

	async execute(settings)
	{
		try
		{
			await this.main(settings);	
		}
		catch(error)
		{
			console.log(`Error occured while executing code for the "${ this.id }" feature:`);
			console.log(error);
			debugger;
		}
	}
}

Feature.instances = [];