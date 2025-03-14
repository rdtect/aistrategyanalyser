interface FilterReturn {
    startsWith(string: string, substring: string): boolean;
    endsWith(string: string, substring: string): boolean;
    contains(string: string, substring: string): boolean;
}
interface FilterOptions extends Intl.CollatorOptions {
    locale?: string | undefined;
}
declare function filter(options?: FilterOptions): FilterReturn;

interface FormatBytesOptions {
    unit?: "bit" | "byte" | undefined;
    unitDisplay?: "long" | "short" | "narrow" | undefined;
}
declare const formatBytes: (bytes: number, locale?: string, options?: FormatBytesOptions) => string;

/**
 * Formats a date using the given format string as defined in:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 */
declare function formatDate(date: Date, format: string, locale: string, timeZone?: string): string;

declare function formatList(list: string[], locale: string, options?: Intl.ListFormatOptions): string;

declare function formatNumber(v: number, locale: string, options?: Intl.NumberFormatOptions): string;

declare function formatRelativeTime(value: Date, locale: string, options?: Intl.RelativeTimeFormatOptions): string;

declare function isRTL(locale: string): boolean;
declare function getLocaleDir(locale: string): "rtl" | "ltr";

type Direction = "rtl" | "ltr";
interface Locale {
    locale: string;
    dir: Direction;
}
declare global {
    interface Navigator {
        userLanguage?: string;
    }
}
declare function getDefaultLocale(): Locale;

interface LocaleOptions {
    locale?: string | undefined;
    getRootNode?: (() => ShadowRoot | Document | Node) | undefined;
    onLocaleChange?: ((locale: Locale) => void) | undefined;
}
declare function trackLocale(options?: LocaleOptions): () => void;

export { type FilterOptions, type FilterReturn, type FormatBytesOptions, type Locale, type LocaleOptions, filter, formatBytes, formatDate, formatList, formatNumber, formatRelativeTime, getDefaultLocale, getLocaleDir, isRTL, trackLocale };
