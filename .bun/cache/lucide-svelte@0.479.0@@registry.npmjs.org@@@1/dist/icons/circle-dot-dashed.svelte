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
const iconNode = [["path", { "d": "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }], ["path", { "d": "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }], ["path", { "d": "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }], ["path", { "d": "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }], ["path", { "d": "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }], ["path", { "d": "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }], ["path", { "d": "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }], ["path", { "d": "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }], ["circle", { "cx": "12", "cy": "12", "r": "1" }]];
/**
 * @component @name CircleDotDashed
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuMSAyLjE4YTkuOTMgOS45MyAwIDAgMSAzLjggMCIgLz4KICA8cGF0aCBkPSJNMTcuNiAzLjcxYTkuOTUgOS45NSAwIDAgMSAyLjY5IDIuNyIgLz4KICA8cGF0aCBkPSJNMjEuODIgMTAuMWE5LjkzIDkuOTMgMCAwIDEgMCAzLjgiIC8+CiAgPHBhdGggZD0iTTIwLjI5IDE3LjZhOS45NSA5Ljk1IDAgMCAxLTIuNyAyLjY5IiAvPgogIDxwYXRoIGQ9Ik0xMy45IDIxLjgyYTkuOTQgOS45NCAwIDAgMS0zLjggMCIgLz4KICA8cGF0aCBkPSJNNi40IDIwLjI5YTkuOTUgOS45NSAwIDAgMS0yLjY5LTIuNyIgLz4KICA8cGF0aCBkPSJNMi4xOCAxMy45YTkuOTMgOS45MyAwIDAgMSAwLTMuOCIgLz4KICA8cGF0aCBkPSJNMy43MSA2LjRhOS45NSA5Ljk1IDAgMCAxIDIuNy0yLjY5IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-dot-dashed
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="circle-dot-dashed" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
