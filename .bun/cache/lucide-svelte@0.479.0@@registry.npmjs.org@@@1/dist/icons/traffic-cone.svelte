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
const iconNode = [["path", { "d": "M9.3 6.2a4.55 4.55 0 0 0 5.4 0" }], ["path", { "d": "M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3" }], ["path", { "d": "M13.9 3.5a1.93 1.93 0 0 0-3.8-.1l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3 5 3s5-1.3 5-3c0-.2 0-.4-.1-.5Z" }], ["path", { "d": "m7.5 12.2-4.7 2.7c-.5.3-.8.7-.8 1.1s.3.8.8 1.1l7.6 4.5c.9.5 2.1.5 3 0l7.6-4.5c.7-.3 1-.7 1-1.1s-.3-.8-.8-1.1l-4.7-2.8" }]];
/**
 * @component @name TrafficCone
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOS4zIDYuMmE0LjU1IDQuNTUgMCAwIDAgNS40IDAiIC8+CiAgPHBhdGggZD0iTTcuOSAxMC43Yy45LjggMi40IDEuMyA0LjEgMS4zczMuMi0uNSA0LjEtMS4zIiAvPgogIDxwYXRoIGQ9Ik0xMy45IDMuNWExLjkzIDEuOTMgMCAwIDAtMy44LS4xbC0zIDEwYy0uMS4yLS4xLjQtLjEuNiAwIDEuNyAyLjIgMyA1IDNzNS0xLjMgNS0zYzAtLjIgMC0uNC0uMS0uNVoiIC8+CiAgPHBhdGggZD0ibTcuNSAxMi4yLTQuNyAyLjdjLS41LjMtLjguNy0uOCAxLjFzLjMuOC44IDEuMWw3LjYgNC41Yy45LjUgMi4xLjUgMyAwbDcuNi00LjVjLjctLjMgMS0uNyAxLTEuMXMtLjMtLjgtLjgtMS4xbC00LjctMi44IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/traffic-cone
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="traffic-cone" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
