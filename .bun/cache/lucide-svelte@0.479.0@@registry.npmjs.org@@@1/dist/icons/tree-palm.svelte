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
const iconNode = [["path", { "d": "M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" }], ["path", { "d": "M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" }], ["path", { "d": "M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" }], ["path", { "d": "M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" }]];
/**
 * @component @name TreePalm
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMgOGMwLTIuNzYtMi40Ni01LTUuNS01UzIgNS4yNCAyIDhoMmwxLTEgMSAxaDQiIC8+CiAgPHBhdGggZD0iTTEzIDcuMTRBNS44MiA1LjgyIDAgMCAxIDE2LjUgNmMzLjA0IDAgNS41IDIuMjQgNS41IDVoLTNsLTEtMS0xIDFoLTMiIC8+CiAgPHBhdGggZD0iTTUuODkgOS43MWMtMi4xNSAyLjE1LTIuMyA1LjQ3LS4zNSA3LjQzbDQuMjQtNC4yNS43LS43LjcxLS43MSAyLjEyLTIuMTJjLTEuOTUtMS45Ni01LjI3LTEuOC03LjQyLjM1IiAvPgogIDxwYXRoIGQ9Ik0xMSAxNS41Yy41IDIuNS0uMTcgNC41LTEgNi41aDRjMi01LjUtLjUtMTItMS0xNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/tree-palm
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="tree-palm" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
