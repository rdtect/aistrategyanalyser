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
const iconNode = [["rect", { "width": "16", "height": "16", "x": "4", "y": "4", "rx": "2" }], ["rect", { "width": "6", "height": "6", "x": "9", "y": "9", "rx": "1" }], ["path", { "d": "M15 2v2" }], ["path", { "d": "M15 20v2" }], ["path", { "d": "M2 15h2" }], ["path", { "d": "M2 9h2" }], ["path", { "d": "M20 15h2" }], ["path", { "d": "M20 9h2" }], ["path", { "d": "M9 2v2" }], ["path", { "d": "M9 20v2" }]];
/**
 * @component @name Cpu
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHg9IjQiIHk9IjQiIHJ4PSIyIiAvPgogIDxyZWN0IHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHg9IjkiIHk9IjkiIHJ4PSIxIiAvPgogIDxwYXRoIGQ9Ik0xNSAydjIiIC8+CiAgPHBhdGggZD0iTTE1IDIwdjIiIC8+CiAgPHBhdGggZD0iTTIgMTVoMiIgLz4KICA8cGF0aCBkPSJNMiA5aDIiIC8+CiAgPHBhdGggZD0iTTIwIDE1aDIiIC8+CiAgPHBhdGggZD0iTTIwIDloMiIgLz4KICA8cGF0aCBkPSJNOSAydjIiIC8+CiAgPHBhdGggZD0iTTkgMjB2MiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/cpu
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="cpu" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
