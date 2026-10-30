{
	"translatorID": "a5cb4b58-9a7a-478d-92a9-bf51d6ea4772",
	"label": "Bible Gateway",
	"creator": "Dandelion Good",
	"target": "^https?://www\\.biblegateway\\.com/passage/",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2026-10-29 22:25:15"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2026 Dandelion Good and the righteous Anti Toil Theologians at Iliff
	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

/*
***** BEGIN ATTRIBUTION BLOCK *****
This translator was developed by Dandelion Good.

If you do any work on this translator, please add yourself here <3.
*/

function isPassageUrl(url) {
	// ToDo already covered in regex
	return url.includes('/passage/');
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	return found ? items: false;
}


function detectWeb(doc, url) {
	Zotero.debug(`in BibleGateway detectWeb for ${url}`);
	if (isPassageUrl(url)) {
		return "bookSection";
	}
	return false;
}

async function doWeb(doc, url) {
	let detected = detectWeb(doc, url)
	Zotero.debug(`in doWeb for ${url}, detected ${detected}`);
	if (detected == 'multiple') {
		// ToDo
		Zotero.debug("found multiple, not yet supported!")
	} else {
		await scrape(doc, url);
	}
}

async function scrape(doc, url) {
	Zotero.debug(`scraping ${url}`)
	let item = new Zotero.Item('bookSection');
	item.language = attr(doc, "html", "lang");

	let itemType = attr(doc, '[property~="og:type"]', 'content');
	let tagNodeList = doc.querySelectorAll(`[property~="og:${itemType}:tag"]`);
	let description = attr(doc, '[property~="og:description"]', 'content');
	const titleTag = doc.querySelector('meta[property="og:title"]');
	let title = doc.title
	if (titleTag) {
		Zotero.debug(`found TitleTag: ${titleTag}`);
		titleText = titleTag.getAttribute('content').split('passage:')[1]?.trim();
		if (titleText) {
			title=titleText
		}
	}
	item.title = title;
	item.abstractNote = description;
	Zotero.debug("node list", tagNodeList);

	printLink = attr(doc, "a.print", "href");
	Zotero.debug(`found printlink: ${printLink}`);
	let attURL = new URL(printLink, url).href;
	let attachedDoc = await requestDocument(attURL);
	Zotero.debug(`got snapshot: ${attachedDoc}`)
	let attachment = {
		title: "Snapshot",
		url: attURL,
		mimeType: "text/html",
		document: attachedDoc
	};
	Zotero.debug(`created attachment: ${attachment}`)
	item.attachments.push(attachment);
	item.complete();
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://www.biblegateway.com/passage/?search=Joshua%203&version=NRSVUE",
		"items": [
			{
				"itemType": "bookSection",
				"title": "Joshua 3 - New Revised Standard Version Updated Edition",
				"creators": [],
				"abstractNote": "Israel Crosses the Jordan - Early in the morning Joshua rose and set out from Shittim with all the Israelites, and they came to the Jordan. They camped there before crossing over. At the end of three days, the officers went through the camp and commanded the people, “When you see the ark of the covenant of the LORD your God being carried by the Levitical priests, then you shall set out from your place. Follow it, so that you may know the way you should go, for you have not passed this way before. Yet there shall be a space between you and it, a distance of about two thousand cubits; do not come any nearer to it.” Then Joshua said to the people, “Sanctify yourselves, for tomorrow the LORD will do wonders among you.”",
				"language": "en",
				"libraryCatalog": "Bible Gateway",
				"attachments": [
					{
						"title": "Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
