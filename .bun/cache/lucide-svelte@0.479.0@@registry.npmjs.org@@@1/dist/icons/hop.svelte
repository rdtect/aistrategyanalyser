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
const iconNode = [["path", { "d": "M10.82 16.12c1.69.6 3.91.79 5.18.85.55.03 1-.42.97-.97-.06-1.27-.26-3.5-.85-5.18" }], ["path", { "d": "M11.5 6.5c1.64 0 5-.38 6.71-1.07.52-.2.55-.82.12-1.17A10 10 0 0 0 4.26 18.33c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.88.88 0 0 0 .73-.74c.3-2.14-.15-3.5-.61-4.88" }], ["path", { "d": "M15.62 16.95c.2.85.62 2.76.5 4.28a.77.77 0 0 1-.9.7 16.64 16.64 0 0 1-4.08-1.36" }], ["path", { "d": "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .96-.96 17.68 17.68 0 0 0-.9-4.87" }], ["path", { "d": "M16.94 15.62c.86.2 2.77.62 4.29.5a.77.77 0 0 0 .7-.9 16.64 16.64 0 0 0-1.36-4.08" }], ["path", { "d": "M17.99 5.52a20.82 20.82 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-2.33.2-5.3-.32-8.27-1.57" }], ["path", { "d": "M4.93 4.93 3 3a.7.7 0 0 1 0-1" }], ["path", { "d": "M9.58 12.18c1.24 2.98 1.77 5.95 1.57 8.28a.8.8 0 0 1-1.13.68 20.82 20.82 0 0 1-4.5-3.15" }]];
/**
 * @component @name Hop
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuODIgMTYuMTJjMS42OS42IDMuOTEuNzkgNS4xOC44NS41NS4wMyAxLS40Mi45Ny0uOTctLjA2LTEuMjctLjI2LTMuNS0uODUtNS4xOCIgLz4KICA8cGF0aCBkPSJNMTEuNSA2LjVjMS42NCAwIDUtLjM4IDYuNzEtMS4wNy41Mi0uMi41NS0uODIuMTItMS4xN0ExMCAxMCAwIDAgMCA0LjI2IDE4LjMzYy4zNS40My45Ni40IDEuMTctLjEyLjY5LTEuNzEgMS4wNy01LjA3IDEuMDctNi43MSAxLjM0LjQ1IDMuMS45IDQuODguNjJhLjg4Ljg4IDAgMCAwIC43My0uNzRjLjMtMi4xNC0uMTUtMy41LS42MS00Ljg4IiAvPgogIDxwYXRoIGQ9Ik0xNS42MiAxNi45NWMuMi44NS42MiAyLjc2LjUgNC4yOGEuNzcuNzcgMCAwIDEtLjkuNyAxNi42NCAxNi42NCAwIDAgMS00LjA4LTEuMzYiIC8+CiAgPHBhdGggZD0iTTE2LjEzIDIxLjA1YzEuNjUuNjMgMy42OC44NCA0Ljg3LjkxYS45LjkgMCAwIDAgLjk2LS45NiAxNy42OCAxNy42OCAwIDAgMC0uOS00Ljg3IiAvPgogIDxwYXRoIGQ9Ik0xNi45NCAxNS42MmMuODYuMiAyLjc3LjYyIDQuMjkuNWEuNzcuNzcgMCAwIDAgLjctLjkgMTYuNjQgMTYuNjQgMCAwIDAtMS4zNi00LjA4IiAvPgogIDxwYXRoIGQ9Ik0xNy45OSA1LjUyYTIwLjgyIDIwLjgyIDAgMCAxIDMuMTUgNC41LjguOCAwIDAgMS0uNjggMS4xM2MtMi4zMy4yLTUuMy0uMzItOC4yNy0xLjU3IiAvPgogIDxwYXRoIGQ9Ik00LjkzIDQuOTMgMyAzYS43LjcgMCAwIDEgMC0xIiAvPgogIDxwYXRoIGQ9Ik05LjU4IDEyLjE4YzEuMjQgMi45OCAxLjc3IDUuOTUgMS41NyA4LjI4YS44LjggMCAwIDEtMS4xMy42OCAyMC44MiAyMC44MiAwIDAgMS00LjUtMy4xNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/hop
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="hop" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
