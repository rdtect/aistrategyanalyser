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
export type NutProps = typeof __propDef.props;
export type NutEvents = typeof __propDef.events;
export type NutSlots = typeof __propDef.slots;
/**
 * @component @name Nut
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNFYyIiAvPgogIDxwYXRoIGQ9Ik01IDEwdjRhNy4wMDQgNy4wMDQgMCAwIDAgNS4yNzcgNi43ODdjLjQxMi4xMDQuODAyLjI5MiAxLjEwMi41OTJMMTIgMjJsLjYyMS0uNjIxYy4zLS4zLjY5LS40ODggMS4xMDItLjU5MkE3LjAwMyA3LjAwMyAwIDAgMCAxOSAxNHYtNCIgLz4KICA8cGF0aCBkPSJNMTIgNEM4IDQgNC41IDYgNCA4Yy0uMjQzLjk3LS45MTkgMS45NTItMiAzIDEuMzEtLjA4MiAxLjk3Mi0uMjkgMy0xIC41NC45Mi45ODIgMS4zNTYgMiAyIDEuNDUyLS42NDcgMS45NTQtMS4wOTggMi41LTIgLjU5NS45OTUgMS4xNTEgMS40MjcgMi41IDIgMS4zMS0uNjIxIDEuODYyLTEuMDU4IDIuNS0yIC42MjkuOTc3IDEuMTYyIDEuNDIzIDIuNSAyIDEuMjA5LS41NDggMS42OC0uOTY3IDItMiAxLjAzMi45MTYgMS42ODMgMS4xNTcgMyAxLTEuMjk3LTEuMDM2LTEuNzU4LTIuMDMtMi0zLS41LTItNC00LTgtNFoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/nut
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
export default class Nut extends SvelteComponentTyped<NutProps, NutEvents, NutSlots> {
}
export {};
