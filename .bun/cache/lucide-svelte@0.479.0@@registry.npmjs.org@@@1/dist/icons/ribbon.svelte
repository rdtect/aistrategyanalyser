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
const iconNode = [["path", { "d": "M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22" }], ["path", { "d": "m12 18 2.57-3.5" }], ["path", { "d": "M6.243 9.016a7 7 0 0 1 11.507-.009" }], ["path", { "d": "M9.35 14.53 12 11.22" }], ["path", { "d": "M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z" }]];
/**
 * @component @name Ribbon
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTEuMjJDMTEgOS45OTcgMTAgOSAxMCA4YTIgMiAwIDAgMSA0IDBjMCAxLS45OTggMi4wMDItMi4wMSAzLjIyIiAvPgogIDxwYXRoIGQ9Im0xMiAxOCAyLjU3LTMuNSIgLz4KICA8cGF0aCBkPSJNNi4yNDMgOS4wMTZhNyA3IDAgMCAxIDExLjUwNy0uMDA5IiAvPgogIDxwYXRoIGQ9Ik05LjM1IDE0LjUzIDEyIDExLjIyIiAvPgogIDxwYXRoIGQ9Ik05LjM1IDE0LjUzQzcuNzI4IDEyLjI0NiA2IDEwLjIyMSA2IDdhNiA1IDAgMCAxIDEyIDBjLS4wMDUgMy4yMi0xLjc3OCA1LjIzNS0zLjQzIDcuNWwzLjU1NyA0LjUyN2ExIDEgMCAwIDEtLjIwMyAxLjQzbC0xLjg5NCAxLjM2YTEgMSAwIDAgMS0xLjM4NC0uMjE1TDEyIDE4bC0yLjY3OSAzLjU5M2ExIDEgMCAwIDEtMS4zOS4yMTNsLTEuODY1LTEuMzUzYTEgMSAwIDAgMS0uMjAzLTEuNDIyeiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/ribbon
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="ribbon" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
