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
export type CloudCogProps = typeof __propDef.props;
export type CloudCogEvents = typeof __propDef.events;
export type CloudCogSlots = typeof __propDef.slots;
/**
 * @component @name CloudCog
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE3IiByPSIzIiAvPgogIDxwYXRoIGQ9Ik00LjIgMTUuMUE3IDcgMCAxIDEgMTUuNzEgOGgxLjc5YTQuNSA0LjUgMCAwIDEgMi41IDguMiIgLz4KICA8cGF0aCBkPSJtMTUuNyAxOC40LS45LS4zIiAvPgogIDxwYXRoIGQ9Im05LjIgMTUuOS0uOS0uMyIgLz4KICA8cGF0aCBkPSJtMTAuNiAyMC43LjMtLjkiIC8+CiAgPHBhdGggZD0ibTEzLjEgMTQuMi4zLS45IiAvPgogIDxwYXRoIGQ9Im0xMy42IDIwLjctLjQtMSIgLz4KICA8cGF0aCBkPSJtMTAuOCAxNC4zLS40LTEiIC8+CiAgPHBhdGggZD0ibTguMyAxOC42IDEtLjQiIC8+CiAgPHBhdGggZD0ibTE0LjcgMTUuOCAxLS40IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/cloud-cog
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
export default class CloudCog extends SvelteComponentTyped<CloudCogProps, CloudCogEvents, CloudCogSlots> {
}
export {};
