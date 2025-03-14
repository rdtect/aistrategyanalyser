import { createNormalizer } from "@zag-js/types";
const propMap = {
    className: "class",
    defaultChecked: "checked",
    defaultValue: "value",
    htmlFor: "for",
    onBlur: "onfocusout",
    onChange: "oninput",
    onFocus: "onfocusin",
    onDoubleClick: "ondblclick",
};
export function toStyleString(style) {
    let string = "";
    for (let key in style) {
        /**
         * Ignore null and undefined values.
         */
        const value = style[key];
        if (value === null || value === undefined)
            continue;
        /**
         * Convert camelCase to kebab-case except for CSS custom properties.
         */
        if (!key.startsWith("--"))
            key = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        string += `${key}:${value};`;
    }
    return string;
}
const preserveKeys = "viewBox,className,preserveAspectRatio,fillRule,clipPath,clipRule,strokeWidth,strokeLinecap,strokeLinejoin,strokeDasharray,strokeDashoffset,strokeMiterlimit".split(",");
function toSvelteProp(key) {
    if (key in propMap)
        return propMap[key];
    if (preserveKeys.includes(key))
        return key;
    return key.toLowerCase();
}
function toSveltePropValue(key, value) {
    if (key === "style" && typeof value === "object")
        return toStyleString(value);
    if (value === false)
        return;
    return value;
}
export const normalizeProps = createNormalizer((props) => {
    const normalized = {};
    for (const key in props) {
        normalized[toSvelteProp(key)] = toSveltePropValue(key, props[key]);
    }
    return normalized;
});
