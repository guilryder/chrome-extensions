## Installation
* Google Chrome: https://chrome.google.com/webstore/detail/url-in-title/ignpacbgnbnkaiooknalneoeladjnfgb
* Microsoft Edge: https://microsoftedge.microsoft.com/addons/detail/ofmgkjflhpkiobhgebefnjncenhjciad

## Summary
Appends the domain name of each tab to their title.

## Description
This allows using utilities such as KeePass that auto-fill passwords according to the title of the current window.

By default, only the protocol and domain name are appended to the title, but the options page allows full customization.

Source code: https://github.com/guilryder/chrome-extensions/tree/main/urlintitle

## Metadata
* Category: Productivity
* Homepage URL: https://github.com/guilryder/chrome-extensions/tree/main/urlintitle
* Support URL: https://github.com/guilryder/chrome-extensions/issues
* Privacy:
  * Single purpose: Rename tabs to include their URL.
  * Storage justification: Storing the user preferences configured in the options page.
  * Host permission justification: Renaming a tab requires executing a content script for that tab. Users need the extension to run automatically on all sites, without an explicit action: the "activeTab" permission is not enough.

## Testing instructions
1. Open any URL, for instance: http://example.org
2. Verify that the tab title contains the tab URL, for instance: "Example Domain - http://example.org/"
3. Edit the extension options to customize the tab title format.
