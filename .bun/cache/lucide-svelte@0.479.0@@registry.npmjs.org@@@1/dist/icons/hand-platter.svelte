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
const iconNode = [["path", { "d": "M12 3V2" }], ["path", { "d": "m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5" }], ["path", { "d": "M2 14h12a2 2 0 0 1 0 4h-2" }], ["path", { "d": "M4 10h16" }], ["path", { "d": "M5 10a7 7 0 0 1 14 0" }], ["path", { "d": "M5 14v6a1 1 0 0 1-1 1H2" }]];
/**
 * @component @name HandPlatter
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM1YyIiAvPgogIDxwYXRoIGQ9Im0xNS40IDE3LjQgMy4yLTIuOGEyIDIgMCAxIDEgMi44IDIuOWwtMy42IDMuM2MtLjcuOC0xLjcgMS4yLTIuOCAxLjJoLTRjLTEuMSAwLTIuMS0uNC0yLjgtMS4ybC0xLjMwMi0xLjQ2NEExIDEgMCAwIDAgNi4xNTEgMTlINSIgLz4KICA8cGF0aCBkPSJNMiAxNGgxMmEyIDIgMCAwIDEgMCA0aC0yIiAvPgogIDxwYXRoIGQ9Ik00IDEwaDE2IiAvPgogIDxwYXRoIGQ9Ik01IDEwYTcgNyAwIDAgMSAxNCAwIiAvPgogIDxwYXRoIGQ9Ik01IDE0djZhMSAxIDAgMCAxLTEgMUgyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hand-platter
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="hand-platter" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
