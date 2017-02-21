// Appends the domain name of each tab to its title.
// For instance, the title of a page http://www.example.com/dir/page.html having
// "Page title" as title becomes:
// "Page title - http://www.example.com/"
//
// Only HTTP and HTTPS pages are affected.
//
// Used by password managers to recognize pages by domain instead of title, for
// more security and stability: page titles change from time to time, are
// language-dependent, and sometimes are too generic (e.g. "Login").

'use strict';

var DEFAULT_OPTIONS = {
  format: "{title} - {protocol}://{hostname}{port}/",
};

// Name to example value.
var LOCATION_FIELDS = {
  "protocol": "http",
  "hostname": "www.xn--exmpl-hra2b.com",
  "port": 8080,
  "pathname": "/sub/path",
  "search": "?arg=value",
  "hash": "#hash",
};

var EXAMPLE_TITLE = "My Example Page";

function getOptions(callback) {
  chrome.storage.sync.get(DEFAULT_OPTIONS, callback);
}

function setOptions(options, callback) {
  chrome.storage.sync.set(options, callback);
}

function clearOptions(callback) {
  chrome.storage.sync.clear(callback);
}

var TAGS = {
  "title": {
    compute: (location, title) => title,
    description: "The page title.",
  },
  "protocol": {
    compute: (location, title) => location.protocol.replace(":", ""),
    description: "The URL protocol, without '<code>://</code>' suffix.",
  },
  "hostname": {
    compute: (location, title) => {
      try {
        return toUnicode(location.hostname);
      } catch(e) {
        return location.hostname;
      }
    },
    description: "The URL hostname, converted from Punycode to Unicode.",
  },
  "hostnameascii": {
    compute: (location, title) => location.hostname,
    description: "The raw URL hostname, not converted from Punycode to Unicode.",
  },
  "port": {
    compute: (location, title) => location.port && (":" + location.port),
    description: "The URL port, prefixed with '<code>:</code>' if not empty.",
  },
  "path": {
    compute: (location, title) => location.pathname.replace(/^\/?/, ""),
    description: "The URL path, without '<code>/</code>' prefix.",
  },
  "args": {
    compute: (location, title) => location.search,
    description: "The URL arguments, prefixed with '<code>?</code>' if not empty.",
  },
  "hash": {
    compute: (location, title) => location.hash,
    description: "The URL hash, prefixed with '<code>#</code>' if not empty.",
  },
};

var FORMAT_REGEXP =
    new RegExp("{(" + Object.keys(TAGS).join("|") + ")}", "g");

function formatPageTitle(format, location, title) {
  return format.replace(FORMAT_REGEXP,
      (format, tag) => TAGS[tag].compute(location, title));
}

class RequestHandlers {
  static get_constants(request, sendResponse) {
    sendResponse({LOCATION_FIELDS: LOCATION_FIELDS});
  }

  static format_title(request, sendResponse) {
    getOptions(options =>
      sendResponse(formatPageTitle(
          options.format, request.location, request.title)));
  }
}

chrome.extension.onRequest.addListener(
  (request, sender, sendResponse) =>
    RequestHandlers[request.name](request, sendResponse));
