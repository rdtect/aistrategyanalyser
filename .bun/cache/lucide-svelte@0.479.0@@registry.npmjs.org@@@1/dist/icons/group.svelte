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
const iconNode = [["path", { "d": "M3 7V5c0-1.1.9-2 2-2h2" }], ["path", { "d": "M17 3h2c1.1 0 2 .9 2 2v2" }], ["path", { "d": "M21 17v2c0 1.1-.9 2-2 2h-2" }], ["path", { "d": "M7 21H5c-1.1 0-2-.9-2-2v-2" }], ["rect", { "width": "7", "height": "5", "x": "7", "y": "7", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "10", "y": "12", "rx": "1" }]];
/**
 * @component @name Group
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA3VjVjMC0xLjEuOS0yIDItMmgyIiAvPgogIDxwYXRoIGQ9Ik0xNyAzaDJjMS4xIDAgMiAuOSAyIDJ2MiIgLz4KICA8cGF0aCBkPSJNMjEgMTd2MmMwIDEuMS0uOSAyLTIgMmgtMiIgLz4KICA8cGF0aCBkPSJNNyAyMUg1Yy0xLjEgMC0yLS45LTItMnYtMiIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSI3IiB5PSI3IiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxMCIgeT0iMTIiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/group
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="group" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
