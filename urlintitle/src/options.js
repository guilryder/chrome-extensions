'use strict';

const lib = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', () => {
  $('restore').addEventListener('click', restoreOptionsToDefault);
  $('save').addEventListener('click', saveOptions);
  $('format').addEventListener('input', updateExample);

  const tags_table = $('tags-table');
  for (const tag in lib.TAGS) {
    const tag_name = '{' + tag + '}';

    const example_value = lib.formatPageTitle(
        tag_name, lib.LOCATION_FIELDS, lib.EXAMPLE_TITLE);

    const row = tags_table.insertRow(-1);
    row.insertCell(-1).appendChild(createTextElem('kbd', tag_name));
    row.insertCell(-1).innerHTML = lib.TAGS[tag].description;
    row.insertCell(-1).appendChild(createTextElem('code', example_value));
  }

  restoreOptions();
});

function updateExample() {
  $('example').textContent = lib.formatPageTitle(
      $('format').value, lib.LOCATION_FIELDS, lib.EXAMPLE_TITLE);
}

function restoreOptions() {
  lib.getOptions((options) => {
    $('format').value = options.format;
    updateExample();
  });
}

function restoreOptionsToDefault() {
  lib.clearOptions(() => {
    showOptionsSaved();
    restoreOptions();
  });
}

function saveOptions() {
  lib.setOptions(
    {format: $('format').value},
    () => {
      showOptionsSaved();
      updateExample();
    });
}

function showOptionsSaved() {
  const status = $('status');
  status.textContent = 'Options saved.';
  setTimeout(() => status.textContent = '', 1000);
}

// Helpers

function $(id) {
  return document.getElementById(id);
}

function createTextElem(tag_name, text) {
  const elem = document.createElement(tag_name);
  elem.textContent = text;
  return elem;
}
