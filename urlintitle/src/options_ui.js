'use strict';

const REGEXPS_SEPARATOR = '\n';

document.addEventListener('DOMContentLoaded', async () => {
  $('default').addEventListener('click', resetOptionsToDefault);
  $('save').addEventListener('click', saveOptions);
  $('format').addEventListener('input', updateExample);

  const tags_table = $('tags-table');
  for (const tag in TAGS) {
    const tag_name = '{' + tag + '}';

    const example_value = formatPageTitle(tag_name, EXAMPLE_ENV);

    const row = tags_table.insertRow(-1);
    row.insertCell(-1).appendChild(createTextElem('kbd', tag_name));
    row.insertCell(-1).innerHTML = TAGS[tag].description;
    row.insertCell(-1).appendChild(createTextElem('code', example_value));
  }

  await applyOptions();
});

function updateExample() {
  $('example').textContent =
      formatPageTitle($('format').value, EXAMPLE_ENV);
}

async function applyOptions() {
  const options = await getOptions();
  $('format').value = options.format;
  $('url-filter-type-' +
          (options.url_filter_is_whitelist ? 'whitelist' : 'blacklist'))
      .checked = true;
  $('url-filter-regexps').value =
      (options.url_filter_regexps || []).join(REGEXPS_SEPARATOR);
  updateExample();
}

async function resetOptionsToDefault() {
  await clearOptions();
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

  await setOptions({
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
