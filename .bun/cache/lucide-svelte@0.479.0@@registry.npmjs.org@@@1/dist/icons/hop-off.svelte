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
const iconNode = [["path", { "d": "M10.82 16.12c1.69.6 3.91.79 5.18.85.28.01.53-.09.7-.27" }], ["path", { "d": "M11.14 20.57c.52.24 2.44 1.12 4.08 1.37.46.06.86-.25.9-.71.12-1.52-.3-3.43-.5-4.28" }], ["path", { "d": "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .7-.26" }], ["path", { "d": "M17.99 5.52a20.83 20.83 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-1.17.1-2.5.02-3.9-.25" }], ["path", { "d": "M20.57 11.14c.24.52 1.12 2.44 1.37 4.08.04.3-.08.59-.31.75" }], ["path", { "d": "M4.93 4.93a10 10 0 0 0-.67 13.4c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.85.85 0 0 0 .48-.24" }], ["path", { "d": "M5.52 17.99c1.05.95 2.91 2.42 4.5 3.15a.8.8 0 0 0 1.13-.68c.2-2.34-.33-5.3-1.57-8.28" }], ["path", { "d": "M8.35 2.68a10 10 0 0 1 9.98 1.58c.43.35.4.96-.12 1.17-1.5.6-4.3.98-6.07 1.05" }], ["path", { "d": "m2 2 20 20" }]];
/**
 * @component @name HopOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuODIgMTYuMTJjMS42OS42IDMuOTEuNzkgNS4xOC44NS4yOC4wMS41My0uMDkuNy0uMjciIC8+CiAgPHBhdGggZD0iTTExLjE0IDIwLjU3Yy41Mi4yNCAyLjQ0IDEuMTIgNC4wOCAxLjM3LjQ2LjA2Ljg2LS4yNS45LS43MS4xMi0xLjUyLS4zLTMuNDMtLjUtNC4yOCIgLz4KICA8cGF0aCBkPSJNMTYuMTMgMjEuMDVjMS42NS42MyAzLjY4Ljg0IDQuODcuOTFhLjkuOSAwIDAgMCAuNy0uMjYiIC8+CiAgPHBhdGggZD0iTTE3Ljk5IDUuNTJhMjAuODMgMjAuODMgMCAwIDEgMy4xNSA0LjUuOC44IDAgMCAxLS42OCAxLjEzYy0xLjE3LjEtMi41LjAyLTMuOS0uMjUiIC8+CiAgPHBhdGggZD0iTTIwLjU3IDExLjE0Yy4yNC41MiAxLjEyIDIuNDQgMS4zNyA0LjA4LjA0LjMtLjA4LjU5LS4zMS43NSIgLz4KICA8cGF0aCBkPSJNNC45MyA0LjkzYTEwIDEwIDAgMCAwLS42NyAxMy40Yy4zNS40My45Ni40IDEuMTctLjEyLjY5LTEuNzEgMS4wNy01LjA3IDEuMDctNi43MSAxLjM0LjQ1IDMuMS45IDQuODguNjJhLjg1Ljg1IDAgMCAwIC40OC0uMjQiIC8+CiAgPHBhdGggZD0iTTUuNTIgMTcuOTljMS4wNS45NSAyLjkxIDIuNDIgNC41IDMuMTVhLjguOCAwIDAgMCAxLjEzLS42OGMuMi0yLjM0LS4zMy01LjMtMS41Ny04LjI4IiAvPgogIDxwYXRoIGQ9Ik04LjM1IDIuNjhhMTAgMTAgMCAwIDEgOS45OCAxLjU4Yy40My4zNS40Ljk2LS4xMiAxLjE3LTEuNS42LTQuMy45OC02LjA3IDEuMDUiIC8+CiAgPHBhdGggZD0ibTIgMiAyMCAyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/hop-off
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="hop-off" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
