## Installation
* Google Chrome: https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe

## Summary
Drops X-Frame-Options and Content-Security-Policy HTTP response headers, allowing all pages to be iframed.

## Description
Should be used only temporarily and only for development, testing, or troubleshooting purposes because it disables important browser security mechanisms. Use at your own risk.

No custom options or installation instructions: just install the extension and enable it on the relevant websites using the standard browser controls.

Reference:
* https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options
* https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy

Source code: https://github.com/guilryder/chrome-extensions/tree/main/xframe_ignore

Release notes:
* v2.0.0: reimplemented with declarativeNetRequest and Manifest V3, no functional change
* v1.2.2: Chrome 89 permission fix
* v1.1.1: added icons

## Metadata
* Category: Developer Tools
* Homepage URL: https://github.com/guilryder/chrome-extensions/tree/main/xframe_ignore
* Support URL: https://github.com/guilryder/chrome-extensions/issues?q=label:xframe_ignore
* Privacy:
  * Single purpose: Drops X-Frame-Options and Content-Security-Policy HTTP response headers, allowing all pages to be iframed for developement, testing, or troubleshooting purposes.
  * `declarativeNetRequest` permission justification: Required to remove HTTP response headers.
