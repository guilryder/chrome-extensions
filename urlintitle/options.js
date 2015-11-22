var lib = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
  $('restore').addEventListener('click', restoreOptionsToDefault);
  $('save').addEventListener('click', saveOptions);
  $('format').addEventListener('input', updateExample);

  var tags_table = $('tags-table');
  for (var tag in lib.TAGS) {
    var tag_name = '{' + tag + '}';

    var example_value = lib.formatPageTitle(
        tag_name, lib.LOCATION_FIELDS, lib.EXAMPLE_TITLE);

    var row = tags_table.insertRow(-1);
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
  lib.getOptions(function(options) {
    $('format').value = options.format;
    updateExample();
  });
}

function restoreOptionsToDefault() {
  lib.clearOptions(function() {
    showOptionsSaved();
    restoreOptions();
  });
}

function saveOptions() {
  lib.setOptions(
    {
      format: $('format').value
    },
    function() {
      showOptionsSaved();
      updateExample();
  });
}

function showOptionsSaved() {
  var status = $('status');
  status.textContent = 'Options saved.';
  setTimeout(function() {
    status.textContent = '';
  }, 1000);
}

// Helpers

function $(id) {
  return document.getElementById(id);
}

function createTextElem(tag_name, text) {
  var elem = document.createElement(tag_name);
  elem.textContent = text;
  return elem;
}
