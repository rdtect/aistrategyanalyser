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
const iconNode = [["path", { "d": "M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" }], ["path", { "d": "M18 11V4H6v7" }], ["path", { "d": "M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4" }], ["path", { "d": "M22 11V9" }], ["path", { "d": "M2 11V9" }], ["path", { "d": "M6 4V2" }], ["path", { "d": "M18 4V2" }], ["path", { "d": "M10 4V2" }], ["path", { "d": "M14 4V2" }]];
/**
 * @component @name Castle
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMjB2LTlIMnY5YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMloiIC8+CiAgPHBhdGggZD0iTTE4IDExVjRINnY3IiAvPgogIDxwYXRoIGQ9Ik0xNSAyMnYtNGEzIDMgMCAwIDAtMy0zYTMgMyAwIDAgMC0zIDN2NCIgLz4KICA8cGF0aCBkPSJNMjIgMTFWOSIgLz4KICA8cGF0aCBkPSJNMiAxMVY5IiAvPgogIDxwYXRoIGQ9Ik02IDRWMiIgLz4KICA8cGF0aCBkPSJNMTggNFYyIiAvPgogIDxwYXRoIGQ9Ik0xMCA0VjIiIC8+CiAgPHBhdGggZD0iTTE0IDRWMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/castle
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="castle" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
