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
const iconNode = [["line", { "x1": "3", "x2": "15", "y1": "22", "y2": "22" }], ["line", { "x1": "4", "x2": "14", "y1": "9", "y2": "9" }], ["path", { "d": "M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" }], ["path", { "d": "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" }]];
/**
 * @component @name Fuel
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMyIgeDI9IjE1IiB5MT0iMjIiIHkyPSIyMiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjE0IiB5MT0iOSIgeTI9IjkiIC8+CiAgPHBhdGggZD0iTTE0IDIyVjRhMiAyIDAgMCAwLTItMkg2YTIgMiAwIDAgMC0yIDJ2MTgiIC8+CiAgPHBhdGggZD0iTTE0IDEzaDJhMiAyIDAgMCAxIDIgMnYyYTIgMiAwIDAgMCAyIDJhMiAyIDAgMCAwIDItMlY5LjgzYTIgMiAwIDAgMC0uNTktMS40MkwxOCA1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/fuel
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="fuel" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
