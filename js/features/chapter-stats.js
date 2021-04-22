(async function()
{
	//
	// Get User Settings
	//

	//const settings = await Setting.getAll();

	//
	// Locals
	//

	/*
	const characterCountScripts = ArchiveConfig.CHARACTER_COUNT_SCRIPTS.map(x => `\\p{${ x }}`).join("|");
	const regExpRaw = `[${ characterCountScripts }]|((?!${ characterCountScripts })[[:word:]])+`;
	const regExp = XRegExp(regExpRaw, "g");
	*/

	const filteredWords = [ "", " ", " ", "\n", "." ];

	/*
	const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
	*/

	// I tried to base this function on WordCounter.count in AO3's source code
	//	https://github.com/otwcode/otwarchive/blob/1f7610f25b28388bd6b2beb4715f2a80ece78ef7/lib/word_counter.rb#L17
	//
	// ...that did not work out so behold my trash logic below, let's consider this experimental?
	async function countNodes(count, node)
	{
		let nodes = node.childNodes;

		for(let node of nodes)
		{
			switch(node.nodeType)
			{
				case Node.TEXT_NODE:
					/*
					let text = node.textContent.replaceAll(/--/g, "—").replaceAll(/'’‘-/g, "");

					XRegExp.forEach(text, regExp, (match, i) =>
					{
						console.log(match);
						count++;
					});
					*/

					const words = node.textContent.replaceAll(/[“,”]/g, "").replaceAll("...", " ").split(/[\s,—]/).filter(word => !filteredWords.includes(word));
					
					count += words.length;

					break;

				case Node.ELEMENT_NODE:
					count = await countNodes(count, node);

					break;

				default:
					break;
			}
		}

		return count;
	}
	
	//
	// Features
	//

	if(await Setting.get("show_chapter_word_counts"))
	{
		for(let chapter of document.querySelectorAll(".chapter > .userstuff.module"))
		{
			const chapterPreface = chapter.parentElement.querySelector(".chapter.preface.group");

			const chapterStats = document.createElement("span");
			chapterStats.classList.add("aes-chapter-stats");
			chapterPreface.insertBefore(chapterStats, chapterPreface.querySelector(".title").nextElementSibling);

			// Approximate Word Count
			{
				const count = await countNodes(0, chapter);
	
				const paragraph = document.createElement("p");
				paragraph.classList.add("aes-chapter-word-count");
				paragraph.innerText = "Words: ~" + count.toString();
				paragraph.title = browser.i18n.getMessage("word_count_approx");
				
				chapterStats.appendChild(paragraph);
			}
		}
	}
})();