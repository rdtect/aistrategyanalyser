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
const iconNode = [["path", { "d": "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }], ["path", { "d": "M9 13a4.5 4.5 0 0 0 3-4" }], ["path", { "d": "M6.003 5.125A3 3 0 0 0 6.401 6.5" }], ["path", { "d": "M3.477 10.896a4 4 0 0 1 .585-.396" }], ["path", { "d": "M6 18a4 4 0 0 1-1.967-.516" }], ["path", { "d": "M12 13h4" }], ["path", { "d": "M12 18h6a2 2 0 0 1 2 2v1" }], ["path", { "d": "M12 8h8" }], ["path", { "d": "M16 8V5a2 2 0 0 1 2-2" }], ["circle", { "cx": "16", "cy": "13", "r": ".5" }], ["circle", { "cx": "18", "cy": "3", "r": ".5" }], ["circle", { "cx": "20", "cy": "21", "r": ".5" }], ["circle", { "cx": "20", "cy": "8", "r": ".5" }]];
/**
 * @component @name BrainCircuit
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAtNS45OTcuMTI1IDQgNCAwIDAgMC0yLjUyNiA1Ljc3IDQgNCAwIDAgMCAuNTU2IDYuNTg4QTQgNCAwIDEgMCAxMiAxOFoiIC8+CiAgPHBhdGggZD0iTTkgMTNhNC41IDQuNSAwIDAgMCAzLTQiIC8+CiAgPHBhdGggZD0iTTYuMDAzIDUuMTI1QTMgMyAwIDAgMCA2LjQwMSA2LjUiIC8+CiAgPHBhdGggZD0iTTMuNDc3IDEwLjg5NmE0IDQgMCAwIDEgLjU4NS0uMzk2IiAvPgogIDxwYXRoIGQ9Ik02IDE4YTQgNCAwIDAgMS0xLjk2Ny0uNTE2IiAvPgogIDxwYXRoIGQ9Ik0xMiAxM2g0IiAvPgogIDxwYXRoIGQ9Ik0xMiAxOGg2YTIgMiAwIDAgMSAyIDJ2MSIgLz4KICA8cGF0aCBkPSJNMTIgOGg4IiAvPgogIDxwYXRoIGQ9Ik0xNiA4VjVhMiAyIDAgMCAxIDItMiIgLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjEzIiByPSIuNSIgLz4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjMiIHI9Ii41IiAvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjEiIHI9Ii41IiAvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iOCIgcj0iLjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/brain-circuit
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="brain-circuit" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
