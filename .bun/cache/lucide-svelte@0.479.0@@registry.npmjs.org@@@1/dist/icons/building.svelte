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
const iconNode = [["rect", { "width": "16", "height": "20", "x": "4", "y": "2", "rx": "2", "ry": "2" }], ["path", { "d": "M9 22v-4h6v4" }], ["path", { "d": "M8 6h.01" }], ["path", { "d": "M16 6h.01" }], ["path", { "d": "M12 6h.01" }], ["path", { "d": "M12 10h.01" }], ["path", { "d": "M12 14h.01" }], ["path", { "d": "M16 10h.01" }], ["path", { "d": "M16 14h.01" }], ["path", { "d": "M8 10h.01" }], ["path", { "d": "M8 14h.01" }]];
/**
 * @component @name Building
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHg9IjQiIHk9IjIiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNOSAyMnYtNGg2djQiIC8+CiAgPHBhdGggZD0iTTggNmguMDEiIC8+CiAgPHBhdGggZD0iTTE2IDZoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiA2aC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMTBoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTE2IDEwaC4wMSIgLz4KICA8cGF0aCBkPSJNMTYgMTRoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDEwaC4wMSIgLz4KICA8cGF0aCBkPSJNOCAxNGguMDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/building
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="building" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
