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
const iconNode = [["path", { "d": "m10 20-1.25-2.5L6 18" }], ["path", { "d": "M10 4 8.75 6.5 6 6" }], ["path", { "d": "m14 20 1.25-2.5L18 18" }], ["path", { "d": "m14 4 1.25 2.5L18 6" }], ["path", { "d": "m17 21-3-6h-4" }], ["path", { "d": "m17 3-3 6 1.5 3" }], ["path", { "d": "M2 12h6.5L10 9" }], ["path", { "d": "m20 10-1.5 2 1.5 2" }], ["path", { "d": "M22 12h-6.5L14 15" }], ["path", { "d": "m4 10 1.5 2L4 14" }], ["path", { "d": "m7 21 3-6-1.5-3" }], ["path", { "d": "m7 3 3 6h4" }]];
/**
 * @component @name Snowflake
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTAgMjAtMS4yNS0yLjVMNiAxOCIgLz4KICA8cGF0aCBkPSJNMTAgNCA4Ljc1IDYuNSA2IDYiIC8+CiAgPHBhdGggZD0ibTE0IDIwIDEuMjUtMi41TDE4IDE4IiAvPgogIDxwYXRoIGQ9Im0xNCA0IDEuMjUgMi41TDE4IDYiIC8+CiAgPHBhdGggZD0ibTE3IDIxLTMtNmgtNCIgLz4KICA8cGF0aCBkPSJtMTcgMy0zIDYgMS41IDMiIC8+CiAgPHBhdGggZD0iTTIgMTJoNi41TDEwIDkiIC8+CiAgPHBhdGggZD0ibTIwIDEwLTEuNSAyIDEuNSAyIiAvPgogIDxwYXRoIGQ9Ik0yMiAxMmgtNi41TDE0IDE1IiAvPgogIDxwYXRoIGQ9Im00IDEwIDEuNSAyTDQgMTQiIC8+CiAgPHBhdGggZD0ibTcgMjEgMy02LTEuNS0zIiAvPgogIDxwYXRoIGQ9Im03IDMgMyA2aDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/snowflake
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="snowflake" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
