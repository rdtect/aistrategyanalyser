/**
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
import { SvelteComponentTyped } from "svelte";
import type { IconProps } from '../types.js';
declare const __propDef: {
    props: IconProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type SlackProps = typeof __propDef.props;
export type SlackEvents = typeof __propDef.events;
export type SlackSlots = typeof __propDef.slots;
/**
 * @component @name Slack
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMyIgaGVpZ2h0PSI4IiB4PSIxMyIgeT0iMiIgcng9IjEuNSIgLz4KICA8cGF0aCBkPSJNMTkgOC41VjEwaDEuNUExLjUgMS41IDAgMSAwIDE5IDguNSIgLz4KICA8cmVjdCB3aWR0aD0iMyIgaGVpZ2h0PSI4IiB4PSI4IiB5PSIxNCIgcng9IjEuNSIgLz4KICA8cGF0aCBkPSJNNSAxNS41VjE0SDMuNUExLjUgMS41IDAgMSAwIDUgMTUuNSIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB4PSIxNCIgeT0iMTMiIHJ4PSIxLjUiIC8+CiAgPHBhdGggZD0iTTE1LjUgMTlIMTR2MS41YTEuNSAxLjUgMCAxIDAgMS41LTEuNSIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB4PSIyIiB5PSI4IiByeD0iMS41IiAvPgogIDxwYXRoIGQ9Ik04LjUgNUgxMFYzLjVBMS41IDEuNSAwIDEgMCA4LjUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/slack
 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Svelte component
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=slack instead. This icon will be removed in v1.0
 */
export default class Slack extends SvelteComponentTyped<SlackProps, SlackEvents, SlackSlots> {
}
export {};
