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
const iconNode = [["path", { "d": "m11.9 12.1 4.514-4.514" }], ["path", { "d": "M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z" }], ["path", { "d": "m6 16 2 2" }], ["path", { "d": "M8.2 9.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4 2 2 0 0 0 1.8-1.2z" }], ["circle", { "cx": "11.5", "cy": "12.5", "r": ".5", "fill": "currentColor" }]];
/**
 * @component @name Guitar
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTEuOSAxMi4xIDQuNTE0LTQuNTE0IiAvPgogIDxwYXRoIGQ9Ik0yMC4xIDIuM2ExIDEgMCAwIDAtMS40IDBsLTEuMTE0IDEuMTE0QTIgMiAwIDAgMCAxNyA0LjgyOHYxLjM0NGEyIDIgMCAwIDEtLjU4NiAxLjQxNEEyIDIgMCAwIDEgMTcuODI4IDdoMS4zNDRhMiAyIDAgMCAwIDEuNDE0LS41ODZMMjEuNyA1LjNhMSAxIDAgMCAwIDAtMS40eiIgLz4KICA8cGF0aCBkPSJtNiAxNiAyIDIiIC8+CiAgPHBhdGggZD0iTTguMiA5LjlDOC43IDguOCA5LjggOCAxMSA4YzIuOCAwIDUgMi4yIDUgNSAwIDEuMi0uOCAyLjMtMS45IDIuOGwtLjkuNEEyIDIgMCAwIDAgMTIgMThhNCA0IDAgMCAxLTQgNGMtMy4zIDAtNi0yLjctNi02YTQgNCAwIDAgMSA0LTQgMiAyIDAgMCAwIDEuOC0xLjJ6IiAvPgogIDxjaXJjbGUgY3g9IjExLjUiIGN5PSIxMi41IiByPSIuNSIgZmlsbD0iY3VycmVudENvbG9yIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/guitar
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="guitar" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
