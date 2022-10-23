'use strict';

(async function() {
  const [tab] = await chrome.tabs.query(
      { active: true, lastFocusedWindow: true });
  if (tab) {
    chrome.tabs.update(tab.id, {'url': 'chrome://apps'});
  }
})();
