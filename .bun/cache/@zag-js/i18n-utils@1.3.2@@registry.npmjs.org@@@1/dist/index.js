'use strict';

var domQuery = require('@zag-js/dom-query');

// src/cache.ts
function i18nCache(Ins) {
  const formatterCache = /* @__PURE__ */ new Map();
  return function create(locale, options) {
    const cacheKey = locale + (options ? Object.entries(options).sort((a, b) => a[0] < b[0] ? -1 : 1).join() : "");
    if (formatterCache.has(cacheKey)) {
      return formatterCache.get(cacheKey);
    }
    let formatter = new Ins(locale, options);
    formatterCache.set(cacheKey, formatter);
    return formatter;
  };
}

// src/filter.ts
var collatorCache = i18nCache(Intl.Collator);
function filter(options) {
  const { locale, ...rest } = options || {};
  const collator = collatorCache(locale || "en-US", { usage: "search", ...rest });
  function normalize(string) {
    string = string.normalize("NFC");
    if (collator.resolvedOptions().ignorePunctuation) {
      string = string.replace(/\p{P}/gu, "");
    }
    return string;
  }
  function startsWith(string, substring) {
    if (substring.length === 0) return true;
    string = normalize(string);
    substring = normalize(substring);
    return collator.compare(string.slice(0, substring.length), substring) === 0;
  }
  function endsWith(string, substring) {
    if (substring.length === 0) return true;
    string = normalize(string);
    substring = normalize(substring);
    return collator.compare(string.slice(-substring.length), substring) === 0;
  }
  function contains(string, substring) {
    if (substring.length === 0) return true;
    string = normalize(string);
    substring = normalize(substring);
    let scan = 0;
    let sliceLen = substring.length;
    for (; scan + sliceLen <= string.length; scan++) {
      let slice = string.slice(scan, scan + sliceLen);
      if (collator.compare(substring, slice) === 0) {
        return true;
      }
    }
    return false;
  }
  return {
    startsWith,
    endsWith,
    contains
  };
}

// src/format-number.ts
var getNumberFormatter = i18nCache(Intl.NumberFormat);
function formatNumber(v, locale, options = {}) {
  const formatter = getNumberFormatter(locale, options);
  return formatter.format(v);
}

// src/format-bytes.ts
var bitPrefixes = ["", "kilo", "mega", "giga", "tera"];
var bytePrefixes = ["", "kilo", "mega", "giga", "tera", "peta"];
var formatBytes = (bytes, locale = "en-US", options = {}) => {
  if (isNaN(bytes)) return "";
  if (bytes === 0) return "0 B";
  const { unit = "byte", unitDisplay = "short" } = options;
  const prefix = unit === "bit" ? bitPrefixes : bytePrefixes;
  const index = Math.max(0, Math.min(Math.floor(Math.log10(bytes) / 3), prefix.length - 1));
  const _unit = prefix[index] + unit;
  const _unitDisplay = unitDisplay || "short";
  const v = parseFloat((bytes / Math.pow(1e3, index)).toPrecision(3));
  return formatNumber(v, locale, {
    style: "unit",
    unit: _unit,
    unitDisplay: _unitDisplay
  });
};

// src/format-date.ts
var symbols = "\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;";
function createRegEx(sign) {
  return new RegExp("(^|>|" + symbols + ")(" + sign + ")($|<|" + symbols + ")", "g");
}
var FORMATS = [
  "G",
  "GG",
  "GGG",
  "GGGG",
  "GGGGG",
  "y",
  "yo",
  "yy",
  "yyy",
  "yyyy",
  "Y",
  "Yo",
  "YY",
  "YYY",
  "YYYY",
  "Q",
  "Qo",
  "QQ",
  "QQQ",
  "QQQQ",
  "QQQQQ",
  "M",
  "Mo",
  "MM",
  "MMM",
  "MMMM",
  "MMMMM",
  "E",
  "EE",
  "EEE",
  "EEEE",
  "EEEEE",
  "EEEEEE",
  "a",
  "aa",
  "aaa",
  "aaaa",
  "aaaaa",
  "d",
  "do",
  "dd",
  "D",
  "Do",
  "DD",
  "DDD",
  "w",
  "wo",
  "ww",
  "s",
  "so",
  "ss",
  "m",
  "mo",
  "mm",
  "h",
  "ho",
  "hh",
  "H",
  "Ho",
  "HH",
  "z",
  "zz",
  "zzz",
  "zzzz",
  "T"
];
function ordinal(num) {
  const n = typeof num === "string" ? parseFloat(num) : num;
  let suffix = "th";
  if (n % 10 === 1 && n % 100 !== 11) {
    suffix = "st";
  } else if (n % 10 === 2 && n % 100 !== 12) {
    suffix = "nd";
  } else if (n % 10 === 3 && n % 100 !== 13) {
    suffix = "rd";
  }
  return `${n}${suffix}`;
}
function pad(num, length) {
  return String(num).padStart(length, "0");
}
function zone(str) {
  return str.split(/AM|PM/)[1].trim();
}
function getFormat(date, options) {
  const { locale, format, timeZone } = options;
  switch (format) {
    // era
    case "G":
    case "GG":
    case "GGG":
      return date.toLocaleString(locale, { era: "short" });
    case "GGGG":
      return date.toLocaleString(locale, { era: "long" });
    case "GGGGG":
      return date.toLocaleString(locale, { era: "narrow" });
    // year
    case "y":
    case "Y":
      return date.getFullYear();
    case "yo":
    case "Yo":
      return ordinal(date.toLocaleString(locale, { year: "numeric" }));
    case "yy":
    case "YY":
      return date.toLocaleString(locale, { year: "2-digit" });
    case "yyy":
    case "YYY":
      return date.toLocaleString(locale, { year: "numeric" }).padStart(3, "0");
    case "yyyy":
    case "YYYY":
      return date.toLocaleString(locale, { year: "numeric" }).padStart(4, "0");
    // quarter
    case "Q":
    case "QQQQQ":
      return Math.ceil((date.getMonth() + 1) / 3);
    case "Qo":
      return ordinal(Math.ceil((date.getMonth() + 1) / 3));
    case "QQ":
      return pad(Math.ceil((date.getMonth() + 1) / 3), 2);
    case "QQQ":
      return `Q${Math.ceil((date.getMonth() + 1) / 3)}`;
    case "QQQQ": {
      const base = ordinal(String(Math.ceil((date.getMonth() + 1) / 3)));
      return `${base} quarter`;
    }
    // month
    case "M":
      return date.getMonth() + 1;
    case "Mo":
      return ordinal(date.getMonth() + 1);
    case "MM":
      return date.toLocaleString(locale, { month: "2-digit" });
    case "MMM":
      return date.toLocaleString(locale, { month: "short" });
    case "MMMM":
      return date.toLocaleString(locale, { month: "long" });
    case "MMMMM":
      return date.toLocaleString(locale, { month: "narrow" });
    // week
    case "w":
      return Math.ceil(date.getDate() / 7);
    case "wo":
      return ordinal(Math.ceil(date.getDate() / 7));
    case "ww":
      return pad(Math.ceil(date.getDate() / 7), 2);
    // day
    case "d":
    case "D":
      return date.getDate();
    case "do":
    case "Do":
      return ordinal(date.getDate());
    case "dd":
    case "DD":
      return date.toLocaleString(locale, { day: "2-digit" });
    case "DDD":
      return pad(date.getDate(), 3);
    // weekday
    case "E":
    case "EE":
    case "EEE":
      return date.toLocaleString(locale, { weekday: "short" });
    case "EEEE":
      return date.toLocaleString(locale, { weekday: "long" });
    case "EEEEE":
      return date.toLocaleString(locale, { weekday: "narrow" });
    case "EEEEEE":
      return date.toLocaleString(locale, { weekday: "short" }).slice(0, 2);
    // hour
    case "h":
      return date.toLocaleString(locale, { hour: "numeric", hour12: true });
    case "ho":
      return ordinal(date.toLocaleString(locale, { hour: "2-digit", hour12: true }));
    case "hh":
      return date.toLocaleString(locale, { hour: "2-digit", hour12: true });
    case "H":
      return date.toLocaleString(locale, { hour: "numeric", hour12: false });
    case "Ho":
      return ordinal(+date.toLocaleString(locale, { hour: "numeric", hour12: false }));
    case "HH":
      return date.toLocaleString(locale, { hour: "2-digit", hour12: false });
    // minute
    case "m":
      return date.toLocaleString(locale, { minute: "numeric" });
    case "mo":
      return ordinal(date.toLocaleString(locale, { minute: "numeric" }));
    case "mm":
      return date.toLocaleString(locale, { minute: "2-digit" });
    // second
    case "s":
      return date.toLocaleString(locale, { second: "numeric" });
    case "so":
      return ordinal(date.toLocaleString(locale, { second: "numeric" }));
    case "ss":
      return date.toLocaleString(locale, { second: "2-digit" });
    // timestamp
    case "T":
      return date.getTime();
    // day period
    case "a":
    case "aa":
    case "aaa":
      return date.toLocaleString(locale, { hour: "numeric", hour12: true }).toLocaleUpperCase();
    case "aaaa":
      return date.toLocaleString(locale, { hour: "numeric", hour12: true }).toLocaleLowerCase();
    case "aaaaa":
      return date.toLocaleString(locale, { hour: "numeric", hour12: true }).charAt(0);
    // TODO:Revise this
    case "z":
    case "zz":
    case "zzz": {
      return zone(date.toLocaleString(locale, { timeZone, timeZoneName: "shortOffset" }));
    }
    case "zzzz":
      return zone(date.toLocaleString(locale, { timeZone, timeZoneName: "longOffset" }));
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}
function formatDate(date, format, locale, timeZone) {
  let result = format;
  for (const key of FORMATS) {
    const res = getFormat(date, { locale, format: key, timeZone });
    result = result.replace(createRegEx(key), "$1" + res + "$3");
  }
  return result;
}

// src/format-list.ts
var getListFormatter = i18nCache(Intl.ListFormat);
function formatList(list, locale, options = {}) {
  const formatter = getListFormatter(locale, options);
  return formatter.format(list);
}

// src/format-relative-time.ts
var getRelativeTimeFormatter = i18nCache(Intl.RelativeTimeFormat);
function formatRelativeTime(value, locale, options = {}) {
  const rtf = getRelativeTimeFormatter(locale, options);
  const now = /* @__PURE__ */ new Date();
  const diff = getDistance(now, value);
  if (diff.years > 0) return rtf.format(diff.years * diff.sign, "year");
  if (diff.months > 0) return rtf.format(diff.months * diff.sign, "month");
  if (diff.weeks > 0) return rtf.format(diff.weeks * diff.sign, "week");
  if (diff.days > 0) return rtf.format(diff.days * diff.sign, "day");
  if (diff.hours > 0) return rtf.format(diff.hours * diff.sign, "hour");
  if (diff.minutes > 0) return rtf.format(diff.minutes * diff.sign, "minute");
  return rtf.format(diff.seconds * diff.sign, "second");
}
var SECOND_TO_MS = 1e3;
var MINUTE_TO_MS = 1e3 * 60;
var HOUR_TO_MS = 1e3 * 60 * 60;
var DAY_TO_MS = 1e3 * 60 * 60 * 24;
var WEEK_TO_MS = 1e3 * 60 * 60 * 24 * 7;
var MONTH_TO_MS = 1e3 * 60 * 60 * 24 * 30;
var YEAR_TO_MS = 1e3 * 60 * 60 * 24 * 365;
function getDistance(startDate, endDate) {
  const endTime = endDate.getTime();
  const startTime = startDate.getTime();
  const distance = Math.abs(endTime - startTime);
  return {
    sign: Math.sign(endTime - startTime),
    days: Math.floor(distance / DAY_TO_MS),
    hours: Math.floor(distance % DAY_TO_MS / HOUR_TO_MS),
    minutes: Math.floor(distance % HOUR_TO_MS / MINUTE_TO_MS),
    seconds: Math.floor(distance % MINUTE_TO_MS / SECOND_TO_MS),
    weeks: Math.floor(distance / WEEK_TO_MS),
    months: Math.floor(distance / MONTH_TO_MS),
    years: Math.floor(distance / YEAR_TO_MS)
  };
}

// src/is-rtl.ts
var RTL_SCRIPTS = /* @__PURE__ */ new Set([
  "Avst",
  "Arab",
  "Armi",
  "Syrc",
  "Samr",
  "Mand",
  "Thaa",
  "Mend",
  "Nkoo",
  "Adlm",
  "Rohg",
  "Hebr"
]);
var RTL_LANGS = /* @__PURE__ */ new Set([
  "ae",
  "ar",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa",
  "glk",
  "he",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi"
]);
function isRTL(locale) {
  if (Intl.Locale) {
    const script = new Intl.Locale(locale).maximize().script ?? "";
    return RTL_SCRIPTS.has(script);
  }
  const lang = locale.split("-")[0];
  return RTL_LANGS.has(lang);
}
function getLocaleDir(locale) {
  return isRTL(locale) ? "rtl" : "ltr";
}

// src/locale.ts
function getDefaultLocale() {
  let locale = typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage) || "en-US";
  return {
    locale,
    dir: isRTL(locale) ? "rtl" : "ltr"
  };
}
function trackLocale(options = {}) {
  const { getRootNode, onLocaleChange } = options;
  onLocaleChange?.(getDefaultLocale());
  const handleLocaleChange = () => {
    onLocaleChange?.(getDefaultLocale());
  };
  const win = getRootNode ? domQuery.getWindow(getRootNode()) : window;
  win.addEventListener("languagechange", handleLocaleChange);
  return () => {
    win.removeEventListener("languagechange", handleLocaleChange);
  };
}

exports.filter = filter;
exports.formatBytes = formatBytes;
exports.formatDate = formatDate;
exports.formatList = formatList;
exports.formatNumber = formatNumber;
exports.formatRelativeTime = formatRelativeTime;
exports.getDefaultLocale = getDefaultLocale;
exports.getLocaleDir = getLocaleDir;
exports.isRTL = isRTL;
exports.trackLocale = trackLocale;
