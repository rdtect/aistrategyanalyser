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
const iconNode = [["path", { "d": "M12 17h1.5" }], ["path", { "d": "M12 22h1.5" }], ["path", { "d": "M12 2h1.5" }], ["path", { "d": "M17.5 22H19a1 1 0 0 0 1-1" }], ["path", { "d": "M17.5 2H19a1 1 0 0 1 1 1v1.5" }], ["path", { "d": "M20 14v3h-2.5" }], ["path", { "d": "M20 8.5V10" }], ["path", { "d": "M4 10V8.5" }], ["path", { "d": "M4 19.5V14" }], ["path", { "d": "M4 4.5A2.5 2.5 0 0 1 6.5 2H8" }], ["path", { "d": "M8 22H6.5a1 1 0 0 1 0-5H8" }]];
/**
 * @component @name BookDashed
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTdoMS41IiAvPgogIDxwYXRoIGQ9Ik0xMiAyMmgxLjUiIC8+CiAgPHBhdGggZD0iTTEyIDJoMS41IiAvPgogIDxwYXRoIGQ9Ik0xNy41IDIySDE5YTEgMSAwIDAgMCAxLTEiIC8+CiAgPHBhdGggZD0iTTE3LjUgMkgxOWExIDEgMCAwIDEgMSAxdjEuNSIgLz4KICA8cGF0aCBkPSJNMjAgMTR2M2gtMi41IiAvPgogIDxwYXRoIGQ9Ik0yMCA4LjVWMTAiIC8+CiAgPHBhdGggZD0iTTQgMTBWOC41IiAvPgogIDxwYXRoIGQ9Ik00IDE5LjVWMTQiIC8+CiAgPHBhdGggZD0iTTQgNC41QTIuNSAyLjUgMCAwIDEgNi41IDJIOCIgLz4KICA8cGF0aCBkPSJNOCAyMkg2LjVhMSAxIDAgMCAxIDAtNUg4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/book-dashed
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="book-dashed" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
