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
const iconNode = [["circle", { "cx": "12", "cy": "12", "r": "2" }], ["path", { "d": "M12 2v4" }], ["path", { "d": "m6.8 15-3.5 2" }], ["path", { "d": "m20.7 7-3.5 2" }], ["path", { "d": "M6.8 9 3.3 7" }], ["path", { "d": "m20.7 17-3.5-2" }], ["path", { "d": "m9 22 3-8 3 8" }], ["path", { "d": "M8 22h8" }], ["path", { "d": "M18 18.7a9 9 0 1 0-12 0" }]];
/**
 * @component @name FerrisWheel
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIyIiAvPgogIDxwYXRoIGQ9Ik0xMiAydjQiIC8+CiAgPHBhdGggZD0ibTYuOCAxNS0zLjUgMiIgLz4KICA8cGF0aCBkPSJtMjAuNyA3LTMuNSAyIiAvPgogIDxwYXRoIGQ9Ik02LjggOSAzLjMgNyIgLz4KICA8cGF0aCBkPSJtMjAuNyAxNy0zLjUtMiIgLz4KICA8cGF0aCBkPSJtOSAyMiAzLTggMyA4IiAvPgogIDxwYXRoIGQ9Ik04IDIyaDgiIC8+CiAgPHBhdGggZD0iTTE4IDE4LjdhOSA5IDAgMSAwLTEyIDAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/ferris-wheel
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="ferris-wheel" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
