/**
 * @license lucide-svelte v0.479.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */
import { SvelteComponentTyped } from "svelte";
import type { IconProps } from '../types.js';
declare const __propDef: {
    props: IconProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type SettingsProps = typeof __propDef.props;
export type SettingsEvents = typeof __propDef.events;
export type SettingsSlots = typeof __propDef.slots;
/**
 * @component @name Settings
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/settings
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
export default class Settings extends SvelteComponentTyped<SettingsProps, SettingsEvents, SettingsSlots> {
}
export {};
