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
const iconNode = [["line", { "x1": "2", "x2": "22", "y1": "2", "y2": "22" }], ["path", { "d": "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" }], ["path", { "d": "M5 10v2a7 7 0 0 0 12 5" }], ["path", { "d": "M15 9.34V5a3 3 0 0 0-5.68-1.33" }], ["path", { "d": "M9 9v3a3 3 0 0 0 5.12 2.12" }], ["line", { "x1": "12", "x2": "12", "y1": "19", "y2": "22" }]];
/**
 * @component @name MicOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMiIgeDI9IjIyIiB5MT0iMiIgeTI9IjIyIiAvPgogIDxwYXRoIGQ9Ik0xOC44OSAxMy4yM0E3LjEyIDcuMTIgMCAwIDAgMTkgMTJ2LTIiIC8+CiAgPHBhdGggZD0iTTUgMTB2MmE3IDcgMCAwIDAgMTIgNSIgLz4KICA8cGF0aCBkPSJNMTUgOS4zNFY1YTMgMyAwIDAgMC01LjY4LTEuMzMiIC8+CiAgPHBhdGggZD0iTTkgOXYzYTMgMyAwIDAgMCA1LjEyIDIuMTIiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTIiIHkxPSIxOSIgeTI9IjIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mic-off
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="mic-off" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
