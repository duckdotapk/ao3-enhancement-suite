{
	//
	// Variables & Util Functions
	//

	const filteredWords = [ "", " ", " ", "\n", "." ];

	async function countNodes(count, node)
	{
		let nodes = node.childNodes;

		for(let node of nodes)
		{
			switch(node.nodeType)
			{
				case Node.TEXT_NODE:
					// TODO: Replicate AO3's actual word counting code.
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
	// Feature
	//

	new Feature("chapter-stats", async function(settings)
	{
		if(settings.show_chapter_word_counts)
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
	});
}