import * as Options from './options_lib.js';
import * as Title from './title_lib.js';

const REGEXPS_SEPARATOR = '\n';

document.addEventListener('DOMContentLoaded', async () => {
  $('default').addEventListener('click', resetOptionsToDefault);
  $('save').addEventListener('click', saveOptions);
  $('format').addEventListener('input', updateExample);

  const tags_table = $('tags-table');
  for (const tag in Title.TAGS) {
    const tag_name = '{' + tag + '}';

    const example_value = Title.formatPageTitle(tag_name, Options.EXAMPLE_ENV);

    const row = tags_table.insertRow(-1);
    row.insertCell(-1).appendChild(createTextElem('kbd', tag_name));
    row.insertCell(-1).innerHTML = Title.TAGS[tag].description;
    row.insertCell(-1).appendChild(createTextElem('code', example_value));
  }

  await applyOptions();
});

function updateExample() {
  $('example').textContent =
      Title.formatPageTitle($('format').value, Options.EXAMPLE_ENV);
}

async function applyOptions() {
  const options = await Options.getOptions();
  $('format').value = options.format;
  $('url-filter-type-' +
          (options.url_filter_is_whitelist ? 'whitelist' : 'blacklist'))
      .checked = true;
  $('url-filter-regexps').value =
      (options.url_filter_regexps || []).join(REGEXPS_SEPARATOR);
  updateExample();
}

async function resetOptionsToDefault() {
  await Options.clearOptions();
  await showOptionsSaved();
}

async function saveOptions() {
  // Validate the URL filter regexps.
  const url_filter_regexps =
      $('url-filter-regexps').value.split(REGEXPS_SEPARATOR);
  for (const regexp of url_filter_regexps) {
    try {
      new RegExp(regexp);
    } catch (e) {
      $('status').textContent =
          'Invalid URL filter regular expression: ' + regexp;
      return;
    }
  }

  await Options.setOptions({
    format: $('format').value,
    url_filter_is_whitelist: $('url-filter-type-whitelist').checked,
    url_filter_regexps: url_filter_regexps,
  });
  await showOptionsSaved();
}

async function showOptionsSaved() {
  const status = $('status');
  status.textContent = 'Options saved.';
  setTimeout(() => status.textContent = '', 1000);

  await applyOptions();
}

// Helpers

const $ = document.getElementById.bind(document);

function createTextElem(tag_name, text) {
  const elem = document.createElement(tag_name);
  elem.textContent = text;
  return elem;
}
