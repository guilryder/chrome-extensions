## Installation
* Google Chrome: https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe

## Description
Drops X-Frame-Options and Content-Security-Policy HTTP response headers, allowing all pages to be iframed.

Should be used only temporarily and only for developement, testing, or troubleshooting purposes because it disables important browser security mechanisms.

No custom options or installation instructions: just install the extension and enable it on the relevant websites using the standard browser constrols.

Reference:
* https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options
* https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy

Source code: https://github.com/guilryder/chrome-extensions/tree/master/xframe_ignore

## Metadata
* Category: Developer Tools
* Homepage URL: https://github.com/guilryder/chrome-extensions/tree/master/xframe_ignore
* Support URL: https://github.com/guilryder/chrome-extensions/issues
* Privacy:
  * Single purpose: Drops X-Frame-Options and Content-Security-Policy HTTP response headers, allowing all pages to be iframed for developement, testing, or troubleshooting purposes.
  * `webRequest` permission justification: Required to examine HTTP response headers.
  * `webRequestBlocking` permission justification: Required to remove HTTP response headers.
  * Host permission justification: Generic developer tool that can filter HTTP response headers of any website.
