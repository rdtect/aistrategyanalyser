<script>/**
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
import Icon from '../Icon.svelte';
const iconNode = [["circle", { "cx": "18", "cy": "15", "r": "3" }], ["circle", { "cx": "9", "cy": "7", "r": "4" }], ["path", { "d": "M10 15H6a4 4 0 0 0-4 4v2" }], ["path", { "d": "m21.7 16.4-.9-.3" }], ["path", { "d": "m15.2 13.9-.9-.3" }], ["path", { "d": "m16.6 18.7.3-.9" }], ["path", { "d": "m19.1 12.2.3-.9" }], ["path", { "d": "m19.6 18.7-.4-1" }], ["path", { "d": "m16.8 12.3-.4-1" }], ["path", { "d": "m14.3 16.6 1-.4" }], ["path", { "d": "m20.7 13.8 1-.4" }]];
/**
 * @component @name UserCog
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjE1IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjkiIGN5PSI3IiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMCAxNUg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8cGF0aCBkPSJtMjEuNyAxNi40LS45LS4zIiAvPgogIDxwYXRoIGQ9Im0xNS4yIDEzLjktLjktLjMiIC8+CiAgPHBhdGggZD0ibTE2LjYgMTguNy4zLS45IiAvPgogIDxwYXRoIGQ9Im0xOS4xIDEyLjIuMy0uOSIgLz4KICA8cGF0aCBkPSJtMTkuNiAxOC43LS40LTEiIC8+CiAgPHBhdGggZD0ibTE2LjggMTIuMy0uNC0xIiAvPgogIDxwYXRoIGQ9Im0xNC4zIDE2LjYgMS0uNCIgLz4KICA8cGF0aCBkPSJtMjAuNyAxMy44IDEtLjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user-cog
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="user-cog" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
