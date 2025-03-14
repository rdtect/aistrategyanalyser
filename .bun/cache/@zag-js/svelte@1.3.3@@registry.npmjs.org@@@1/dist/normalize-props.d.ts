import type { SvelteHTMLElements, HTMLAttributes } from "svelte/elements";
export type PropTypes = SvelteHTMLElements & {
    element: HTMLAttributes<HTMLElement>;
    style?: HTMLAttributes<HTMLElement>["style"];
};
export declare function toStyleString(style: Record<string, number | string>): string;
export declare const normalizeProps: import("@zag-js/types").NormalizeProps<PropTypes>;
