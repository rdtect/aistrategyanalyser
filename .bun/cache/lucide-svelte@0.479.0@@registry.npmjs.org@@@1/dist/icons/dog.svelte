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
const iconNode = [["path", { "d": "M11.25 16.25h1.5L12 17z" }], ["path", { "d": "M16 14v.5" }], ["path", { "d": "M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" }], ["path", { "d": "M8 14v.5" }], ["path", { "d": "M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" }]];
/**
 * @component @name Dog
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuMjUgMTYuMjVoMS41TDEyIDE3eiIgLz4KICA8cGF0aCBkPSJNMTYgMTR2LjUiIC8+CiAgPHBhdGggZD0iTTQuNDIgMTEuMjQ3QTEzLjE1MiAxMy4xNTIgMCAwIDAgNCAxNC41NTZDNCAxOC43MjggNy41ODIgMjEgMTIgMjFzOC0yLjI3MiA4LTYuNDQ0YTExLjcwMiAxMS43MDIgMCAwIDAtLjQ5My0zLjMwOSIgLz4KICA8cGF0aCBkPSJNOCAxNHYuNSIgLz4KICA8cGF0aCBkPSJNOC41IDguNWMtLjM4NCAxLjA1LTEuMDgzIDIuMDI4LTIuMzQ0IDIuNS0xLjkzMS43MjItMy41NzYtLjI5Ny0zLjY1Ni0xLS4xMTMtLjk5NCAxLjE3Ny02LjUzIDQtNyAxLjkyMy0uMzIxIDMuNjUxLjg0NSAzLjY1MSAyLjIzNUE3LjQ5NyA3LjQ5NyAwIDAgMSAxNCA1LjI3N2MwLTEuMzkgMS44NDQtMi41OTggMy43NjctMi4yNzcgMi44MjMuNDcgNC4xMTMgNi4wMDYgNCA3LS4wOC43MDMtMS43MjUgMS43MjItMy42NTYgMS0xLjI2MS0uNDcyLTEuODU1LTEuNDUtMi4yMzktMi41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dog
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="dog" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
