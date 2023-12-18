import {normalizeTitle} from './title_lib.js';

const DEFAULT_OPTIONS = {
  format: '{title} - {protocol}://{hostname}{port}/',
  url_filter_is_whitelist: false,
  url_filter_regexps: [],
};

// Name to example value.
export const LOCATION_FIELDS = {
  'protocol': 'http',
  'hostname': 'www.xn--exmpl-hra2b.com',
  'port': 8080,
  'pathname': '/sub/path',
  'search': '?arg=value',
  'hash': '#hash',
};

export const EXAMPLE_ENV = {
  location: LOCATION_FIELDS,
  title: 'My Example Page',
};


function normalizeOptions(options) {
  options.format = normalizeTitle(options.format);
  options.url_filter_is_whitelist = !!options.url_filter_is_whitelist;
  options.url_filter_regexps =
      (options.url_filter_regexps || []).filter(regexp => regexp != '');
}

export async function getOptions() {
  const options = await chrome.storage.sync.get(DEFAULT_OPTIONS);
  normalizeOptions(options);
  return options;
}

export async function setOptions(options) {
  normalizeOptions(options);
  await chrome.storage.sync.set(options);
}

export async function clearOptions() {
  await chrome.storage.sync.clear();
}
