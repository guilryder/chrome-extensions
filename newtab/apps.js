chrome.tabs.getCurrent(function(tab) {
  window.setTimeout(function() {
    chrome.tabs.update(tab.id, {
      'url': 'chrome://apps'
    });
  }, 200);
});

