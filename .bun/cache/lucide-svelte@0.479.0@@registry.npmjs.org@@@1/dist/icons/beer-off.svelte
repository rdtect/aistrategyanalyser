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
const iconNode = [["path", { "d": "M13 13v5" }], ["path", { "d": "M17 11.47V8" }], ["path", { "d": "M17 11h1a3 3 0 0 1 2.745 4.211" }], ["path", { "d": "m2 2 20 20" }], ["path", { "d": "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" }], ["path", { "d": "M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268" }], ["path", { "d": "M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12" }], ["path", { "d": "M9 14.6V18" }]];
/**
 * @component @name BeerOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMgMTN2NSIgLz4KICA8cGF0aCBkPSJNMTcgMTEuNDdWOCIgLz4KICA8cGF0aCBkPSJNMTcgMTFoMWEzIDMgMCAwIDEgMi43NDUgNC4yMTEiIC8+CiAgPHBhdGggZD0ibTIgMiAyMCAyMCIgLz4KICA8cGF0aCBkPSJNNSA4djEyYTIgMiAwIDAgMCAyIDJoOGEyIDIgMCAwIDAgMi0ydi0zIiAvPgogIDxwYXRoIGQ9Ik03LjUzNiA3LjUzNUM2Ljc2NiA3LjY0OSA2LjE1NCA4IDUuNSA4YTIuNSAyLjUgMCAwIDEtMS43NjgtNC4yNjgiIC8+CiAgPHBhdGggZD0iTTguNzI3IDMuMjA0QzkuMzA2IDIuNzY3IDkuODg1IDIgMTEgMmMxLjU2IDAgMiAxLjUgMyAxLjVzMS43Mi0uNSAyLjUtLjVhMSAxIDAgMSAxIDAgNWMtLjc4IDAtMS41LS41LTIuNS0uNWEzLjE0OSAzLjE0OSAwIDAgMC0uODQyLjEyIiAvPgogIDxwYXRoIGQ9Ik05IDE0LjZWMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/beer-off
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="beer-off" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
