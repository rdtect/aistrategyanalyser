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
const iconNode = [["circle", { "cx": "12", "cy": "12", "r": "4" }], ["path", { "d": "M12 3v1" }], ["path", { "d": "M12 20v1" }], ["path", { "d": "M3 12h1" }], ["path", { "d": "M20 12h1" }], ["path", { "d": "m18.364 5.636-.707.707" }], ["path", { "d": "m6.343 17.657-.707.707" }], ["path", { "d": "m5.636 5.636.707.707" }], ["path", { "d": "m17.657 17.657.707.707" }]];
/**
 * @component @name SunMedium
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAzdjEiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjEiIC8+CiAgPHBhdGggZD0iTTMgMTJoMSIgLz4KICA8cGF0aCBkPSJNMjAgMTJoMSIgLz4KICA8cGF0aCBkPSJtMTguMzY0IDUuNjM2LS43MDcuNzA3IiAvPgogIDxwYXRoIGQ9Im02LjM0MyAxNy42NTctLjcwNy43MDciIC8+CiAgPHBhdGggZD0ibTUuNjM2IDUuNjM2LjcwNy43MDciIC8+CiAgPHBhdGggZD0ibTE3LjY1NyAxNy42NTcuNzA3LjcwNyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/sun-medium
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="sun-medium" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
