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
const iconNode = [["path", { "d": "m12 14-1 1" }], ["path", { "d": "m13.75 18.25-1.25 1.42" }], ["path", { "d": "M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" }], ["path", { "d": "M18.8 9.3a1 1 0 0 0 2.1 7.7" }], ["path", { "d": "M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z" }]];
/**
 * @component @name Pizza
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTQtMSAxIiAvPgogIDxwYXRoIGQ9Im0xMy43NSAxOC4yNS0xLjI1IDEuNDIiIC8+CiAgPHBhdGggZD0iTTE3Ljc3NSA1LjY1NGExNS42OCAxNS42OCAwIDAgMC0xMi4xMjEgMTIuMTIiIC8+CiAgPHBhdGggZD0iTTE4LjggOS4zYTEgMSAwIDAgMCAyLjEgNy43IiAvPgogIDxwYXRoIGQ9Ik0yMS45NjQgMjAuNzMyYTEgMSAwIDAgMS0xLjIzMiAxLjIzMmwtMTgtNWExIDEgMCAwIDEtLjY5NS0xLjIzMkExOS42OCAxOS42OCAwIDAgMSAxNS43MzIgMi4wMzdhMSAxIDAgMCAxIDEuMjMyLjY5NXoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pizza
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="pizza" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
