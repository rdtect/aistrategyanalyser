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
const iconNode = [["path", { "d": "M3 3h.01" }], ["path", { "d": "M7 5h.01" }], ["path", { "d": "M11 7h.01" }], ["path", { "d": "M3 7h.01" }], ["path", { "d": "M7 9h.01" }], ["path", { "d": "M3 11h.01" }], ["rect", { "width": "4", "height": "4", "x": "15", "y": "5" }], ["path", { "d": "m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" }], ["path", { "d": "m13 14 8-2" }], ["path", { "d": "m13 19 8-2" }]];
/**
 * @component @name SprayCan
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAzaC4wMSIgLz4KICA8cGF0aCBkPSJNNyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMTEgN2guMDEiIC8+CiAgPHBhdGggZD0iTTMgN2guMDEiIC8+CiAgPHBhdGggZD0iTTcgOWguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTFoLjAxIiAvPgogIDxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHg9IjE1IiB5PSI1IiAvPgogIDxwYXRoIGQ9Im0xOSA5IDIgMnYxMGMwIC42LS40IDEtMSAxaC02Yy0uNiAwLTEtLjQtMS0xVjExbDItMiIgLz4KICA8cGF0aCBkPSJtMTMgMTQgOC0yIiAvPgogIDxwYXRoIGQ9Im0xMyAxOSA4LTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/spray-can
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="spray-can" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
