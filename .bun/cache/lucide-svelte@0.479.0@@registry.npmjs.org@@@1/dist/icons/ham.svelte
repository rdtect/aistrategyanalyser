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
const iconNode = [["path", { "d": "M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856" }], ["path", { "d": "M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288" }], ["path", { "d": "M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025" }], ["path", { "d": "m8.5 16.5-1-1" }]];
/**
 * @component @name Ham
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMuMTQ0IDIxLjE0NEE3LjI3NCAxMC40NDUgNDUgMSAwIDIuODU2IDEwLjg1NiIgLz4KICA8cGF0aCBkPSJNMTMuMTQ0IDIxLjE0NEE3LjI3NCA0LjM2NSA0NSAwIDAgMi44NTYgMTAuODU2YTcuMjc0IDQuMzY1IDQ1IDAgMCAxMC4yODggMTAuMjg4IiAvPgogIDxwYXRoIGQ9Ik0xNi41NjUgMTAuNDM1IDE4LjYgOC40YTIuNTAxIDIuNTAxIDAgMSAwIDEuNjUtNC42NSAyLjUgMi41IDAgMSAwLTQuNjYgMS42NmwtMi4wMjQgMi4wMjUiIC8+CiAgPHBhdGggZD0ibTguNSAxNi41LTEtMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/ham
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="ham" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
