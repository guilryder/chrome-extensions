'use strict';

(function() {

let title_mutation_observer = null;

// The last known title set by the page, before formatting.
let last_original_title = null;

// The last formatted title before any browser post-processing.
let last_formatted_title = null;

// The last formatted_title_suffix returned by format_title_update.
let last_formatted_title_suffix = null;

// The last formatted title after browser post-processing (e.g. trimming).
let last_postprocessed_title = null;


function requestUpdateTitle() {
  // Detect the initial and subsequent, programmatic title changes.
  if (last_postprocessed_title !== document.title) {
    last_original_title = document.title;
    last_formatted_title = null;
  }

  chrome.extension.sendRequest(
    {name: 'get_constants'},
    updateTitle);
}

function updateTitle(constants) {
  // Explicitly copy the required location fields that Chrome strips out.
  const location_copy = {};
  Object.keys(constants.LOCATION_FIELDS).forEach(
    field => location_copy[field] = document.location[field]);

  // Ask the background script to format the title.
  chrome.extension.sendRequest(
      {
        name: 'format_title_update',
        location: location_copy,
        filtering_url: document.location.href,
        title: last_original_title,
        previous_formatted_title_suffix: last_formatted_title_suffix,
      },
      result => {
        if (result) {
          setFormattedTitle(
              result.formatted_title,
              result.formatted_title_suffix);
        }
      });
}

function setFormattedTitle(formatted_title, formatted_title_suffix) {
  // Set the title only if it has changed, to avoid recursive notifications.
  if (last_formatted_title !== formatted_title) {
    last_formatted_title = formatted_title;
    document.title = formatted_title;
    last_postprocessed_title = document.title;
    last_formatted_title_suffix = formatted_title_suffix;
  }

  // Register the observer now that 'head > title' is guaranteed to exist.
  if (!title_mutation_observer) {
    registerTitleMutationObserver();
  }
}

// Calls requestUpdateTitle() on future, programmatic title changes.
// Can be called only once 'head > title' is guaranteed to exist.
function registerTitleMutationObserver() {
  title_mutation_observer = new window.MutationObserver(
      mutations => {
        if (last_postprocessed_title !== document.title) {  // optimization
          requestUpdateTitle();
        }
      });
  title_mutation_observer.observe(
      document.querySelector('head > title'),
      {
        subtree: true,
        characterData: true,
        childList: true,
      });
}

if (!document.cannot_update_title) {
  requestUpdateTitle();
}

})();
