'use strict';

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
        formatPageTitle(format, Object.assign({}, env, {title: ''}));

    // Strip the previous suffix from the title if present, to avoid
    // formatPageTitle() below appending another suffix to the previous one.
    let title = env.title;
    if (previous_formatted_title_suffix &&
        title.endsWith(previous_formatted_title_suffix)) {
      title = title.substring(
          0, title.length - previous_formatted_title_suffix.length);
    }
    env = Object.assign({}, env, {title: title});
  } else {
    // Not a {title}-prefixed format.
    formatted_title_suffix = null;
  }

  return {
    formatted_title: formatPageTitle(format, env),
    formatted_title_suffix: formatted_title_suffix,
  };
}

class MessageHandlers {
  static get_constants(message, sendResponse) {
    sendResponse({LOCATION_FIELDS: LOCATION_FIELDS});
  }

  static format_title_update(message, sendResponse) {
    getOptions(options => {
      if (!shouldProcessUrl(options, message.filtering_url)) {
        sendResponse(null);
        return;
      }

      sendResponse(
          formatPageTitleUpdate(
              options.format,
              {
                location: message.location,
                title: message.title,
              },
              message.previous_formatted_title_suffix));
    });
    return true;  // async response
  }
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) =>
    MessageHandlers[message.name](message, sendResponse));
