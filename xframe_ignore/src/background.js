const HEADERS_TO_STRIP_LOWERCASE = [
  "content-security-policy",
  "x-frame-options",
];

chrome.storage.sync.get("sites", function (data) {
  let ALLOWED_SITES = data.sites;

  if (!ALLOWED_SITES) {
    ALLOWED_SITES = "<all_urls>";
  }

  chrome.webRequest.onHeadersReceived.addListener(
    (details) => ({
      responseHeaders: details.responseHeaders.filter(
        (header) =>
          !HEADERS_TO_STRIP_LOWERCASE.includes(header.name.toLowerCase())
      ),
    }),
    {
      urls: [ALLOWED_SITES],
    },
    ["blocking", "responseHeaders"]
  );
});
