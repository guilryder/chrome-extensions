'use strict';

(function() {

// Ignore the page if <head> does not exist or <head urlintitle="disabled">.
if (!document.head || document.head.getAttribute('urlintitle') == 'disabled') {
  return;
}

// The last known title set by the page, before formatting.
// Reset to null after each update.
let last_original_title = null;

// The last formatted title before any browser post-processing.
let last_formatted_title = null;

// The last formatted_title_suffix returned by format_title_update.
let last_formatted_title_suffix = null;

// The last formatted title after browser post-processing (e.g. trimming).
let last_postprocessed_title = null;


function requestUpdateTitle() {
  const current_title = document.title;

  // Drop redundant update requests:
  // - an update is already pending for the current title
  // - the current title is the result of the last update
  if (last_original_title === current_title ||
      last_postprocessed_title === current_title) {
    return;
  }

  last_original_title = current_title;
  last_formatted_title = null;

  chrome.runtime.sendMessage({name: 'get_constants'}, updateTitle);
}

function updateTitle(constants) {
  // Explicitly copy the required location fields that Chrome strips out.
  const location_copy = {};
  Object.keys(constants.LOCATION_FIELDS).forEach(
    field => location_copy[field] = document.location[field]);

  // Ask the background script to format the title.
  chrome.runtime.sendMessage(
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
  last_original_title = null;
}

function setFormattedTitle(formatted_title, formatted_title_suffix) {
  // Set the title only if it has changed, to avoid recursive notifications.
  if (last_formatted_title !== formatted_title) {
    last_formatted_title = formatted_title;
    document.title = formatted_title;
    last_postprocessed_title = document.title;
    last_formatted_title_suffix = formatted_title_suffix;
  }
}

// Calls requestUpdateTitle() on future, programmatic title changes.
// Listens for all <head> updates, not just <title> because the page can delete
// it with document.querySelector('head > title').remove().
// Known limitation: do not handle document.head.remove() by listening for
// all of document, because deleting <head> is unlikely and breaks the
// connection between document.title and the tab title.
function registerTitleMutationObserver() {
  const observer = new window.MutationObserver(
      (mutations, observer) => requestUpdateTitle());
  observer.observe(
      document.head,
      {
        subtree: true,
        childList: true,
      });
}

requestUpdateTitle();
registerTitleMutationObserver();

})();
