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
export type DiamondPercentProps = typeof __propDef.props;
export type DiamondPercentEvents = typeof __propDef.events;
export type DiamondPercentSlots = typeof __propDef.slots;
/**
 * @component @name DiamondPercent
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi43IDEwLjNhMi40MSAyLjQxIDAgMCAwIDAgMy40MWw3LjU5IDcuNTlhMi40MSAyLjQxIDAgMCAwIDMuNDEgMGw3LjU5LTcuNTlhMi40MSAyLjQxIDAgMCAwIDAtMy40MUwxMy43IDIuNzFhMi40MSAyLjQxIDAgMCAwLTMuNDEgMFoiIC8+CiAgPHBhdGggZD0iTTkuMiA5LjJoLjAxIiAvPgogIDxwYXRoIGQ9Im0xNC41IDkuNS01IDUiIC8+CiAgPHBhdGggZD0iTTE0LjcgMTQuOGguMDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/diamond-percent
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
export default class DiamondPercent extends SvelteComponentTyped<DiamondPercentProps, DiamondPercentEvents, DiamondPercentSlots> {
}
export {};
