// this code listens for browser action button to be clicked and then adds sincerity code to the steemit.com page
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.ib, {
		file: 'sincerity.js'
	});
});
