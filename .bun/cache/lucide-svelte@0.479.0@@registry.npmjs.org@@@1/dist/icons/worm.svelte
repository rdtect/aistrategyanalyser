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
const iconNode = [["path", { "d": "m19 12-1.5 3" }], ["path", { "d": "M19.63 18.81 22 20" }], ["path", { "d": "M6.47 8.23a1.68 1.68 0 0 1 2.44 1.93l-.64 2.08a6.76 6.76 0 0 0 10.16 7.67l.42-.27a1 1 0 1 0-2.73-4.21l-.42.27a1.76 1.76 0 0 1-2.63-1.99l.64-2.08A6.66 6.66 0 0 0 3.94 3.9l-.7.4a1 1 0 1 0 2.55 4.34z" }]];
/**
 * @component @name Worm
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTkgMTItMS41IDMiIC8+CiAgPHBhdGggZD0iTTE5LjYzIDE4LjgxIDIyIDIwIiAvPgogIDxwYXRoIGQ9Ik02LjQ3IDguMjNhMS42OCAxLjY4IDAgMCAxIDIuNDQgMS45M2wtLjY0IDIuMDhhNi43NiA2Ljc2IDAgMCAwIDEwLjE2IDcuNjdsLjQyLS4yN2ExIDEgMCAxIDAtMi43My00LjIxbC0uNDIuMjdhMS43NiAxLjc2IDAgMCAxLTIuNjMtMS45OWwuNjQtMi4wOEE2LjY2IDYuNjYgMCAwIDAgMy45NCAzLjlsLS43LjRhMSAxIDAgMSAwIDIuNTUgNC4zNHoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/worm
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="worm" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
