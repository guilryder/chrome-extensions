'use strict';

const TAGS = {
  "title": {
    compute: (env) => env.title,
    description: "The page title.",
  },
  "protocol": {
    compute: (env) => env.location.protocol.replace(":", ""),
    description: "The URL protocol, without '<code>://</code>' suffix.",
  },
  "hostname": {
    compute: (env) => {
      try {
        return toUnicode(env.location.hostname);
      } catch(e) {
        return env.location.hostname;
      }
    },
    description: "The URL hostname, converted from Punycode to Unicode.",
  },
  "hostnameascii": {
    compute: (env) => env.location.hostname,
    description: "The raw URL hostname, not converted from Punycode to Unicode.",
  },
  "port": {
    compute: (env) => env.location.port && (":" + env.location.port),
    description: "The URL port, prefixed with '<code>:</code>' if not empty.",
  },
  "path": {
    compute: (env) => env.location.pathname.replace(/^\/?/, ""),
    description: "The URL path, without '<code>/</code>' prefix.",
  },
  "args": {
    compute: (env) => env.location.search,
    description: "The URL arguments, prefixed with '<code>?</code>' if not empty.",
  },
  "hash": {
    compute: (env) => env.location.hash,
    description: "The URL hash, prefixed with '<code>#</code>' if not empty.",
  },
};

const FORMAT_REGEXP =
    new RegExp("{(" + Object.keys(TAGS).join("|") + ")}", "g");

function normalizeTitle(title) {
  return (title || '').trim().replace(/\s+/g, ' ');
}

/**
 * env: same format as EXAMPLE_ENV
 */
function formatPageTitle(format, env) {
  return normalizeTitle(format.replace(FORMAT_REGEXP,
      (format, tag) => TAGS[tag].compute(env)));
}
