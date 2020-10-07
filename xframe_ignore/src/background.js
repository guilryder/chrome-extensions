chrome.storage.sync.get("sites", function (data) {
  const ALLOWED_SITES = data.sites;
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

const HEADERS_TO_STRIP_LOWERCASE = [
  "content-security-policy",
  "x-frame-options",
];
