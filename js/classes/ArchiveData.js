class ArchiveData
{
	static async getUserId(pseud)
	{
		const page = await fetch("/users/" + pseud + "/profile");

		const html = await page.text();

		const match = ArchiveData.userIdRegexp.exec(html);

		if(match != null)
			return parseInt(match[1]);
		else
			return undefined;
	}
}

ArchiveData.userIdRegexp = /<dt>My user ID is:<\/dt>\s+<dd>(\d+)<\/dd>/;