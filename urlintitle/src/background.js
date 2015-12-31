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

var DEFAULT_OPTIONS = {
  format: "{title} - {protocol}://{hostname}{port}/",
};

// Name to example value.
var LOCATION_FIELDS = {
  "protocol": "http",
  "hostname": "www.example.com",
  "port": 8080,
  "pathname": "/sub/path",
  "search": "?arg=value",
  "hash": "#hash",
};

var EXAMPLE_TITLE = 'My Example Page';

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
    compute: function(location, title) {
      return title;
    },
    description: "The page title.",
  },
  "protocol": {
    compute: function(location, title) {
      return location.protocol.replace(":", "");
    },
    description: "The URL protocol, without '<code>://</code>' suffix.",
  },
  "hostname": {
    compute: function(location, title) {
      return location.hostname;
    },
    description: "The URL hostname.",
  },
  "port": {
    compute: function(location, title) {
      return location.port && (":" + location.port);
    },
    description: "The URL port, prefixed with '<code>:</code>' if not empty.",
  },
  "path": {
    compute: function(location, title) {
      return location.pathname.replace(/^\/?/, "");
    },
    description: "The URL path, without '<code>/</code>' prefix.",
  },
  "args": {
    compute: function(location, title) {
      return location.search;
    },
    description: "The URL arguments, prefixed with '<code>?</code>' if not empty.",
  },
  "hash": {
    compute: function(location, title) {
      return location.hash;
    },
    description: "The URL hash, prefixed with '<code>#</code>' if not empty.",
  },
};

var FORMAT_REGEXP = function() {
  var tag_names = [];
  for (tag in TAGS) {
    tag_names.push(tag);
  }
  return new RegExp("{(" + tag_names.join("|") + ")}", "g");
}();

function formatPageTitle(format, location, title) {
  return format.replace(FORMAT_REGEXP, function(format, tag) {
    return TAGS[tag].compute(location, title);
  });
}

var REQUEST_HANDLERS = {
  get_constants: function(request, sendResponse) {
    sendResponse({LOCATION_FIELDS: LOCATION_FIELDS});
  },
  format_title: function(request, sendResponse) {
    getOptions(function(options) {
      sendResponse(formatPageTitle(
          options.format, request.location, request.title));
    });
  }
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    REQUEST_HANDLERS[request.name](request, sendResponse);
  });
