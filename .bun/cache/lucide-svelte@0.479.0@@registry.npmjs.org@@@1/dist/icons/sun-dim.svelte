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
const iconNode = [["circle", { "cx": "12", "cy": "12", "r": "4" }], ["path", { "d": "M12 4h.01" }], ["path", { "d": "M20 12h.01" }], ["path", { "d": "M12 20h.01" }], ["path", { "d": "M4 12h.01" }], ["path", { "d": "M17.657 6.343h.01" }], ["path", { "d": "M17.657 17.657h.01" }], ["path", { "d": "M6.343 17.657h.01" }], ["path", { "d": "M6.343 6.343h.01" }]];
/**
 * @component @name SunDim
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiA0aC4wMSIgLz4KICA8cGF0aCBkPSJNMjAgMTJoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAyMGguMDEiIC8+CiAgPHBhdGggZD0iTTQgMTJoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNy42NTcgNi4zNDNoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNy42NTcgMTcuNjU3aC4wMSIgLz4KICA8cGF0aCBkPSJNNi4zNDMgMTcuNjU3aC4wMSIgLz4KICA8cGF0aCBkPSJNNi4zNDMgNi4zNDNoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sun-dim
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="sun-dim" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
