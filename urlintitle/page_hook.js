(function() {

var title_mutation_observer = null;

// The last known title set by the page, before formatting.
var last_original_title = null;

// The last formatted title before any browser post-processing.
var last_formatted_title = null;

// The last formatted title after browser post-processing (e.g. trimming).
var last_postprocessed_title = null;


function requestUpdateTitle() {
  // Detect the initial and subsequent, programmatic title changes.
  if (last_postprocessed_title !== document.title) {
    last_original_title = document.title;
  }

  chrome.extension.sendRequest(
    {name: 'get_constants'},
    updateTitle);
}

function updateTitle(constants) {
  // Explicitly copy the required location fields that Chrome strips out.
  var location_copy = {};
  for (var field in constants.LOCATION_FIELDS) {
    location_copy[field] = document.location[field];
  }

  // Ask the background script to format the title.
  chrome.extension.sendRequest(
      {
        name: 'format_title',
        location: location_copy,
        title: last_original_title,
      },
      setFormattedTitle);
}

function setFormattedTitle(formatted_title) {
  // Set the title only if it has changed, to avoid recursive notifications.
  if (last_formatted_title !== formatted_title) {
    last_formatted_title = formatted_title;
    document.title = formatted_title;
    last_postprocessed_title = document.title;
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
      function(mutations) {
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
