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
const iconNode = [["path", { "d": "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" }], ["path", { "d": "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" }], ["path", { "d": "M12 2v2" }], ["path", { "d": "M12 22v-2" }], ["path", { "d": "m17 20.66-1-1.73" }], ["path", { "d": "M11 10.27 7 3.34" }], ["path", { "d": "m20.66 17-1.73-1" }], ["path", { "d": "m3.34 7 1.73 1" }], ["path", { "d": "M14 12h8" }], ["path", { "d": "M2 12h2" }], ["path", { "d": "m20.66 7-1.73 1" }], ["path", { "d": "m3.34 17 1.73-1" }], ["path", { "d": "m17 3.34-1 1.73" }], ["path", { "d": "m11 13.73-4 6.93" }]];
/**
 * @component @name Cog
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjBhOCA4IDAgMSAwIDAtMTYgOCA4IDAgMCAwIDAgMTZaIiAvPgogIDxwYXRoIGQ9Ik0xMiAxNGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDRaIiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIydi0yIiAvPgogIDxwYXRoIGQ9Im0xNyAyMC42Ni0xLTEuNzMiIC8+CiAgPHBhdGggZD0iTTExIDEwLjI3IDcgMy4zNCIgLz4KICA8cGF0aCBkPSJtMjAuNjYgMTctMS43My0xIiAvPgogIDxwYXRoIGQ9Im0zLjM0IDcgMS43MyAxIiAvPgogIDxwYXRoIGQ9Ik0xNCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik0yIDEyaDIiIC8+CiAgPHBhdGggZD0ibTIwLjY2IDctMS43MyAxIiAvPgogIDxwYXRoIGQ9Im0zLjM0IDE3IDEuNzMtMSIgLz4KICA8cGF0aCBkPSJtMTcgMy4zNC0xIDEuNzMiIC8+CiAgPHBhdGggZD0ibTExIDEzLjczLTQgNi45MyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/cog
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="cog" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
