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
export type CroissantProps = typeof __propDef.props;
export type CroissantEvents = typeof __propDef.events;
export type CroissantSlots = typeof __propDef.slots;
/**
 * @component @name Croissant
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNC42IDEzLjExIDUuNzktMy4yMWMxLjg5LTEuMDUgNC43OSAxLjc4IDMuNzEgMy43MWwtMy4yMiA1LjgxQzguOCAyMy4xNi43OSAxNS4yMyA0LjYgMTMuMTFaIiAvPgogIDxwYXRoIGQ9Im0xMC41IDkuNS0xLTIuMjlDOS4yIDYuNDggOC44IDYgOCA2SDQuNUMyLjc5IDYgMiA2LjUgMiA4LjVhNy43MSA3LjcxIDAgMCAwIDIgNC44MyIgLz4KICA8cGF0aCBkPSJNOCA2YzAtMS41NS4yNC00LTItNC0yIDAtMi41IDIuMTctMi41IDQiIC8+CiAgPHBhdGggZD0ibTE0LjUgMTMuNSAyLjI5IDFjLjczLjMgMS4yMS43IDEuMjEgMS41djMuNWMwIDEuNzEtLjUgMi41LTIuNSAyLjVhNy43MSA3LjcxIDAgMCAxLTQuODMtMiIgLz4KICA8cGF0aCBkPSJNMTggMTZjMS41NSAwIDQtLjI0IDQgMiAwIDItMi4xNyAyLjUtNCAyLjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/croissant
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
export default class Croissant extends SvelteComponentTyped<CroissantProps, CroissantEvents, CroissantSlots> {
}
export {};
