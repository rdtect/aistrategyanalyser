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
const iconNode = [["path", { "d": "M4 6 2 7" }], ["path", { "d": "M10 6h4" }], ["path", { "d": "m22 7-2-1" }], ["rect", { "width": "16", "height": "16", "x": "4", "y": "3", "rx": "2" }], ["path", { "d": "M4 11h16" }], ["path", { "d": "M8 15h.01" }], ["path", { "d": "M16 15h.01" }], ["path", { "d": "M6 19v2" }], ["path", { "d": "M18 21v-2" }]];
/**
 * @component @name BusFront
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCA2IDIgNyIgLz4KICA8cGF0aCBkPSJNMTAgNmg0IiAvPgogIDxwYXRoIGQ9Im0yMiA3LTItMSIgLz4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHg9IjQiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik00IDExaDE2IiAvPgogIDxwYXRoIGQ9Ik04IDE1aC4wMSIgLz4KICA8cGF0aCBkPSJNMTYgMTVoLjAxIiAvPgogIDxwYXRoIGQ9Ik02IDE5djIiIC8+CiAgPHBhdGggZD0iTTE4IDIxdi0yIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/bus-front
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="bus-front" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
