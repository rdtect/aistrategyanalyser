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
export type ServerCogProps = typeof __propDef.props;
export type ServerCogEvents = typeof __propDef.events;
export type ServerCogSlots = typeof __propDef.slots;
/**
 * @component @name ServerCog
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgogIDxwYXRoIGQ9Ik00LjUgMTBINGEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmgxNmEyIDIgMCAwIDEgMiAydjRhMiAyIDAgMCAxLTIgMmgtLjUiIC8+CiAgPHBhdGggZD0iTTQuNSAxNEg0YTIgMiAwIDAgMC0yIDJ2NGEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTRhMiAyIDAgMCAwLTItMmgtLjUiIC8+CiAgPHBhdGggZD0iTTYgNmguMDEiIC8+CiAgPHBhdGggZD0iTTYgMThoLjAxIiAvPgogIDxwYXRoIGQ9Im0xNS43IDEzLjQtLjktLjMiIC8+CiAgPHBhdGggZD0ibTkuMiAxMC45LS45LS4zIiAvPgogIDxwYXRoIGQ9Im0xMC42IDE1LjcuMy0uOSIgLz4KICA8cGF0aCBkPSJtMTMuNiAxNS43LS40LTEiIC8+CiAgPHBhdGggZD0ibTEwLjggOS4zLS40LTEiIC8+CiAgPHBhdGggZD0ibTguMyAxMy42IDEtLjQiIC8+CiAgPHBhdGggZD0ibTE0LjcgMTAuOCAxLS40IiAvPgogIDxwYXRoIGQ9Im0xMy40IDguMy0uMy45IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/server-cog
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
export default class ServerCog extends SvelteComponentTyped<ServerCogProps, ServerCogEvents, ServerCogSlots> {
}
export {};
