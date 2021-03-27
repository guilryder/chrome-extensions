'use strict';

const DEFAULT_OPTIONS = {
  format: "{title} - {protocol}://{hostname}{port}/",
  url_filter_is_whitelist: false,
  url_filter_regexps: [],
};

// Name to example value.
const LOCATION_FIELDS = {
  "protocol": "http",
  "hostname": "www.xn--exmpl-hra2b.com",
  "port": 8080,
  "pathname": "/sub/path",
  "search": "?arg=value",
  "hash": "#hash",
};

const EXAMPLE_ENV = {
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
