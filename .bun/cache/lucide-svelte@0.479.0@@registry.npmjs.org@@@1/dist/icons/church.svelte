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
const iconNode = [["path", { "d": "M10 9h4" }], ["path", { "d": "M12 7v5" }], ["path", { "d": "M14 22v-4a2 2 0 0 0-4 0v4" }], ["path", { "d": "M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22" }], ["path", { "d": "m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7" }]];
/**
 * @component @name Church
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgOWg0IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djUiIC8+CiAgPHBhdGggZD0iTTE0IDIydi00YTIgMiAwIDAgMC00IDB2NCIgLz4KICA8cGF0aCBkPSJNMTggMjJWNS42MThhMSAxIDAgMCAwLS41NTMtLjg5NGwtNC41NTMtMi4yNzdhMiAyIDAgMCAwLTEuNzg4IDBMNi41NTMgNC43MjRBMSAxIDAgMCAwIDYgNS42MThWMjIiIC8+CiAgPHBhdGggZD0ibTE4IDcgMy40NDcgMS43MjRhMSAxIDAgMCAxIC41NTMuODk0VjIwYTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjkuNjE4YTEgMSAwIDAgMSAuNTUzLS44OTRMNiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/church
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 *
 */
</script>

<Icon name="church" {...$$props} iconNode={iconNode}>
  <slot/>
</Icon>
