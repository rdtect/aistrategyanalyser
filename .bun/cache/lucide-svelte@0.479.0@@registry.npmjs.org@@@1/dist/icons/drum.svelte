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
const iconNode = [["path", { "d": "m2 2 8 8" }], ["path", { "d": "m22 2-8 8" }], ["ellipse", { "cx": "12", "cy": "9", "rx": "10", "ry": "5" }], ["path", { "d": "M7 13.4v7.9" }], ["path", { "d": "M12 14v8" }], ["path", { "d": "M17 13.4v7.9" }], ["path", { "d": "M2 9v8a10 5 0 0 0 20 0V9" }]];
/**
 * @component @name Drum
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMiAyIDggOCIgLz4KICA8cGF0aCBkPSJtMjIgMi04IDgiIC8+CiAgPGVsbGlwc2UgY3g9IjEyIiBjeT0iOSIgcng9IjEwIiByeT0iNSIgLz4KICA8cGF0aCBkPSJNNyAxMy40djcuOSIgLz4KICA8cGF0aCBkPSJNMTIgMTR2OCIgLz4KICA8cGF0aCBkPSJNMTcgMTMuNHY3LjkiIC8+CiAgPHBhdGggZD0iTTIgOXY4YTEwIDUgMCAwIDAgMjAgMFY5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/drum
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="drum" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
