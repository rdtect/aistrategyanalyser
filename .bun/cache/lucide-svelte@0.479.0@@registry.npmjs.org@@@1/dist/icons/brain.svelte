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
const iconNode = [["path", { "d": "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }], ["path", { "d": "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" }], ["path", { "d": "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" }], ["path", { "d": "M17.599 6.5a3 3 0 0 0 .399-1.375" }], ["path", { "d": "M6.003 5.125A3 3 0 0 0 6.401 6.5" }], ["path", { "d": "M3.477 10.896a4 4 0 0 1 .585-.396" }], ["path", { "d": "M19.938 10.5a4 4 0 0 1 .585.396" }], ["path", { "d": "M6 18a4 4 0 0 1-1.967-.516" }], ["path", { "d": "M19.967 17.484A4 4 0 0 1 18 18" }]];
/**
 * @component @name Brain
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAtNS45OTcuMTI1IDQgNCAwIDAgMC0yLjUyNiA1Ljc3IDQgNCAwIDAgMCAuNTU2IDYuNTg4QTQgNCAwIDEgMCAxMiAxOFoiIC8+CiAgPHBhdGggZD0iTTEyIDVhMyAzIDAgMSAxIDUuOTk3LjEyNSA0IDQgMCAwIDEgMi41MjYgNS43NyA0IDQgMCAwIDEtLjU1NiA2LjU4OEE0IDQgMCAxIDEgMTIgMThaIiAvPgogIDxwYXRoIGQ9Ik0xNSAxM2E0LjUgNC41IDAgMCAxLTMtNCA0LjUgNC41IDAgMCAxLTMgNCIgLz4KICA8cGF0aCBkPSJNMTcuNTk5IDYuNWEzIDMgMCAwIDAgLjM5OS0xLjM3NSIgLz4KICA8cGF0aCBkPSJNNi4wMDMgNS4xMjVBMyAzIDAgMCAwIDYuNDAxIDYuNSIgLz4KICA8cGF0aCBkPSJNMy40NzcgMTAuODk2YTQgNCAwIDAgMSAuNTg1LS4zOTYiIC8+CiAgPHBhdGggZD0iTTE5LjkzOCAxMC41YTQgNCAwIDAgMSAuNTg1LjM5NiIgLz4KICA8cGF0aCBkPSJNNiAxOGE0IDQgMCAwIDEtMS45NjctLjUxNiIgLz4KICA8cGF0aCBkPSJNMTkuOTY3IDE3LjQ4NEE0IDQgMCAwIDEgMTggMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/brain
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="brain" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
