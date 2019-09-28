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
  url_filter_is_whitelist: false,
  url_filter_regexps: [],
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

var EXAMPLE_ENV = {
  location: LOCATION_FIELDS,
  title: "My Example Page",
};

function normalizeOptions(options) {
  options.format = normalizeTitle(options.format);
  options.url_filter_is_whitelist = !!options.url_filter_is_whitelist;
  options.url_filter_regexps =
      (options.url_filter_regexps || []).filter(regexp => regexp != '');
}

function getOptions(callback) {
  chrome.storage.sync.get(DEFAULT_OPTIONS, options => {
    normalizeOptions(options);
    callback(options);
  });
}

function setOptions(options, callback) {
  normalizeOptions(options);
  chrome.storage.sync.set(options, callback);
}

function clearOptions(callback) {
  chrome.storage.sync.clear(callback);
}

var TAGS = {
  "title": {
    compute: (env) => env.title,
    description: "The page title.",
  },
  "protocol": {
    compute: (env) => env.location.protocol.replace(":", ""),
    description: "The URL protocol, without '<code>://</code>' suffix.",
  },
  "hostname": {
    compute: (env) => {
      try {
        return toUnicode(env.location.hostname);
      } catch(e) {
        return env.location.hostname;
      }
    },
    description: "The URL hostname, converted from Punycode to Unicode.",
  },
  "hostnameascii": {
    compute: (env) => env.location.hostname,
    description: "The raw URL hostname, not converted from Punycode to Unicode.",
  },
  "port": {
    compute: (env) => env.location.port && (":" + env.location.port),
    description: "The URL port, prefixed with '<code>:</code>' if not empty.",
  },
  "path": {
    compute: (env) => env.location.pathname.replace(/^\/?/, ""),
    description: "The URL path, without '<code>/</code>' prefix.",
  },
  "args": {
    compute: (env) => env.location.search,
    description: "The URL arguments, prefixed with '<code>?</code>' if not empty.",
  },
  "hash": {
    compute: (env) => env.location.hash,
    description: "The URL hash, prefixed with '<code>#</code>' if not empty.",
  },
};

var FORMAT_REGEXP =
    new RegExp("{(" + Object.keys(TAGS).join("|") + ")}", "g");

function normalizeTitle(title) {
  return (title || '').trim().replace(/\s+/g, ' ');
}

/**
 * env: same format as EXAMPLE_ENV
 */
function formatPageTitle(format, env) {
  return normalizeTitle(format.replace(FORMAT_REGEXP,
      (format, tag) => TAGS[tag].compute(env)));
}

/**
 * Returns whether the given URL passes the filter (whitelist or blacklist).
 */
function shouldProcessUrl(options, url) {
  const at_least_one_match =
      options.url_filter_regexps.some(
          regexp => url.search(new RegExp(regexp)) >= 0);
  return at_least_one_match == options.url_filter_is_whitelist;
}

/**
 * env: same format as EXAMPLE_ENV
 * previous_formatted_title_suffix: should be the formatted_title_suffix
 *   value returned by the previous call to formatPageTitleUpdate().
 *   Theoretically undefined but usually ok behavior if the format changes
 *   between two calls.
 */
function formatPageTitleUpdate(format, env, previous_formatted_title_suffix) {
  let formatted_title_suffix;

  // Heuristic to support pages that update their title and preserve the text
  // that the extension appends, such as:
  // document.title = "prefix" + document.title;
  // Supports only formats like: "{title}..." that contain only one {title} tag.
  const format_split = format.match(/^\{title\}([\s\S]*$)/);
  if (format_split && !format_split[1].match(/\{title\}/g)) {
    // Supported {title}-prefixed format: generate the title suffix.
    formatted_title_suffix =
        formatPageTitle(format, Object.assign({title: ''}, env));

    // Strip the previous suffix from the title if present, to avoid
    // formatPageTitle() below appending another suffix to the previous one.
    let title = env.title;
    if (previous_formatted_title_suffix &&
        title.endsWith(previous_formatted_title_suffix)) {
      title = title.substring(
          0, title.length - previous_formatted_title_suffix.length);
    }
    env = Object.assign({title: title}, env);
  } else {
    // Not a {title}-prefixed format.
    formatted_title_suffix = null;
  }

  return {
    formatted_title: formatPageTitle(format, env),
    formatted_title_suffix: formatted_title_suffix,
  };
}

class RequestHandlers {
  static get_constants(request, sendResponse) {
    sendResponse({LOCATION_FIELDS: LOCATION_FIELDS});
  }

  static format_title_update(request, sendResponse) {
    getOptions(options => {
      if (!shouldProcessUrl(options, request.filtering_url)) {
        sendResponse(null);
        return;
      }

      sendResponse(
          formatPageTitleUpdate(
              options.format,
              {
                location: request.location,
                title: request.title,
              },
              request.previous_formatted_title_suffix));
    });
  }
}

chrome.extension.onRequest.addListener(
  (request, sender, sendResponse) =>
    RequestHandlers[request.name](request, sendResponse));
