import { InteractOutsideHandlers } from '@zag-js/dismissable';
export { FocusOutsideEvent, InteractOutsideEvent, PointerDownOutsideEvent } from '@zag-js/dismissable';
import * as _zag_js_anatomy from '@zag-js/anatomy';
import { CollectionOptions, ListCollection, CollectionItem } from '@zag-js/collection';
export { CollectionItem, CollectionOptions } from '@zag-js/collection';
import { RequiredBy, DirectionProperty, CommonProperties, PropTypes, NormalizeProps } from '@zag-js/types';
import * as _zag_js_core from '@zag-js/core';
import { Service, EventObject, Machine } from '@zag-js/core';
import { PositioningOptions, Placement } from '@zag-js/popper';
export { Placement, PositioningOptions } from '@zag-js/popper';

declare const anatomy: _zag_js_anatomy.AnatomyInstance<"content" | "list" | "label" | "input" | "root" | "item" | "clearTrigger" | "control" | "itemGroup" | "itemGroupLabel" | "itemIndicator" | "itemText" | "positioner" | "trigger">;

declare const collection: {
    <T extends unknown>(options: CollectionOptions<T>): ListCollection<T>;
    empty(): ListCollection<CollectionItem>;
};

interface ValueChangeDetails<T extends CollectionItem = CollectionItem> {
    value: string[];
    items: T[];
}
interface HighlightChangeDetails<T extends CollectionItem = CollectionItem> {
    highlightedValue: string | null;
    highlightedItem: T | null;
}
interface InputValueChangeDetails {
    inputValue: string;
}
interface OpenChangeDetails {
    open: boolean;
}
interface ScrollToIndexDetails {
    index: number;
    immediate?: boolean | undefined;
}
interface NavigateDetails {
    value: string | null;
    node: HTMLAnchorElement;
}
interface IntlTranslations {
    triggerLabel?: string | undefined;
    clearTriggerLabel?: string | undefined;
}
type ElementIds = Partial<{
    root: string;
    label: string;
    control: string;
    input: string;
    content: string;
    trigger: string;
    clearTrigger: string;
    item(id: string, index?: number): string;
    positioner: string;
    itemGroup(id: string | number): string;
    itemGroupLabel(id: string | number): string;
}>;
interface ComboboxProps<T extends CollectionItem = CollectionItem> extends DirectionProperty, CommonProperties, InteractOutsideHandlers {
    /**
     * The controlled open state of the combobox
     */
    open?: boolean | undefined;
    /**
     * The initial open state of the combobox when rendered.
     * Use when you don't need to control the open state of the combobox.
     */
    defaultOpen?: boolean | undefined;
    /**
     * The ids of the elements in the combobox. Useful for composition.
     */
    ids?: ElementIds | undefined;
    /**
     * The controlled value of the combobox's input
     */
    inputValue?: string | undefined;
    /**
     * The initial value of the combobox's input when rendered.
     * Use when you don't need to control the value of the combobox's input.
     * @default ""
     */
    defaultInputValue?: string | undefined;
    /**
     * The `name` attribute of the combobox's input. Useful for form submission
     */
    name?: string | undefined;
    /**
     * The associate form of the combobox.
     */
    form?: string | undefined;
    /**
     * Whether the combobox is disabled
     */
    disabled?: boolean | undefined;
    /**
     * Whether the combobox is readonly. This puts the combobox in a "non-editable" mode
     * but the user can still interact with it
     */
    readOnly?: boolean | undefined;
    /**
     * Whether the combobox is invalid
     */
    invalid?: boolean | undefined;
    /**
     * Whether the combobox is required
     */
    required?: boolean | undefined;
    /**
     * The placeholder text of the combobox's input
     */
    placeholder?: string | undefined;
    /**
     * The initial highlighted value of the combobox when rendered.
     * Use when you don't need to control the highlighted value of the combobox.
     */
    defaultHighlightedValue?: string | null | undefined;
    /**
     * The controlled highlighted value of the combobox
     */
    highlightedValue?: string | null | undefined;
    /**
     * The controlled value of the combobox's selected items
     */
    value?: string[] | undefined;
    /**
     * The initial value of the combobox's selected items when rendered.
     * Use when you don't need to control the value of the combobox's selected items.
     * @default []
     */
    defaultValue?: string[] | undefined;
    /**
     * Defines the auto-completion behavior of the combobox.
     *
     * - `autohighlight`: The first focused item is highlighted as the user types
     * - `autocomplete`: Navigating the listbox with the arrow keys selects the item and the input is updated
     *
     * @default "none"
     */
    inputBehavior?: "autohighlight" | "autocomplete" | "none" | undefined;
    /**
     * The behavior of the combobox input when an item is selected
     *
     * - `replace`: The selected item string is set as the input value
     * - `clear`: The input value is cleared
     * - `preserve`: The input value is preserved
     *
     * @default "replace"
     */
    selectionBehavior?: "clear" | "replace" | "preserve" | undefined;
    /**
     * Whether to autofocus the input on mount
     */
    autoFocus?: boolean | undefined;
    /**
     * Whether to open the combobox popup on initial click on the input
     * @default false
     */
    openOnClick?: boolean | undefined;
    /**
     * Whether to show the combobox when the input value changes
     * @default true
     */
    openOnChange?: boolean | ((details: InputValueChangeDetails) => boolean) | undefined;
    /**
     * Whether to allow typing custom values in the input
     */
    allowCustomValue?: boolean | undefined;
    /**
     * Whether to loop the keyboard navigation through the items
     * @default true
     */
    loopFocus?: boolean | undefined;
    /**
     * The positioning options to dynamically position the menu
     * @default { placement: "bottom-start" }
     */
    positioning?: PositioningOptions | undefined;
    /**
     * Function called when the input's value changes
     */
    onInputValueChange?: ((details: InputValueChangeDetails) => void) | undefined;
    /**
     * Function called when a new item is selected
     */
    onValueChange?: ((details: ValueChangeDetails<T>) => void) | undefined;
    /**
     * Function called when an item is highlighted using the pointer
     * or keyboard navigation.
     */
    onHighlightChange?: ((details: HighlightChangeDetails<T>) => void) | undefined;
    /**
     * Function called when the popup is opened
     */
    onOpenChange?: ((details: OpenChangeDetails) => void) | undefined;
    /**
     * Specifies the localized strings that identifies the accessibility elements and their states
     */
    translations?: IntlTranslations | undefined;
    /**
     * The collection of items
     */
    collection?: ListCollection<T> | undefined;
    /**
     * Whether to allow multiple selection.
     *
     * **Good to know:** When `multiple` is `true`, the `selectionBehavior` is automatically set to `clear`.
     * It is recommended to render the selected items in a separate container.
     */
    multiple?: boolean | undefined;
    /**
     * Whether to close the combobox when an item is selected.
     */
    closeOnSelect?: boolean | undefined;
    /**
     * Whether to open the combobox on arrow key press
     * @default true
     */
    openOnKeyPress?: boolean | undefined;
    /**
     * Function to scroll to a specific index
     */
    scrollToIndexFn?: ((details: ScrollToIndexDetails) => void) | undefined;
    /**
     * Whether the combobox is a composed with other composite widgets like tabs
     * @default true
     */
    composite?: boolean | undefined;
    /**
     * Whether to disable registering this a dismissable layer
     */
    disableLayer?: boolean | undefined;
    /**
     * Function to navigate to the selected item
     */
    navigate?: ((details: NavigateDetails) => void) | undefined;
}
type PropsWithDefault = "openOnChange" | "openOnKeyPress" | "composite" | "navigate" | "loopFocus" | "positioning" | "openOnClick" | "openOnChange" | "inputBehavior" | "collection" | "selectionBehavior" | "closeOnSelect" | "translations" | "positioning";
interface ComboboxSchema<T extends CollectionItem = CollectionItem> {
    props: RequiredBy<ComboboxProps<T>, PropsWithDefault>;
    state: "idle" | "focused" | "suggesting" | "interacting";
    tag: "open" | "focused" | "idle" | "closed";
    context: {
        value: string[];
        inputValue: string;
        highlightedValue: string | null;
        currentPlacement?: Placement | undefined;
        highlightedItem: T | null;
        selectedItems: T[];
        valueAsString: string;
    };
    computed: {
        isInputValueEmpty: boolean;
        isInteractive: boolean;
        autoComplete: boolean;
        autoHighlight: boolean;
        hasSelectedItems: boolean;
    };
    event: EventObject;
    action: string;
    effect: string;
    guard: string;
}
type ComboboxService<T extends CollectionItem = CollectionItem> = Service<ComboboxSchema<T>>;
type ComboboxMachine<T extends CollectionItem = CollectionItem> = Machine<ComboboxSchema<T>>;
interface TriggerProps {
    /**
     * Whether the trigger is focusable
     */
    focusable?: boolean | undefined;
}
interface ItemProps {
    /**
     * Whether hovering outside should clear the highlighted state
     */
    persistFocus?: boolean | undefined;
    /**
     * The item to render
     */
    item: CollectionItem;
}
interface ItemState {
    /**
     * The value of the item
     */
    value: string;
    /**
     * Whether the item is disabled
     */
    disabled: boolean;
    /**
     * Whether the item is selected
     */
    selected: boolean;
    /**
     * Whether the item is highlighted via pointer or keyboard navigation
     */
    highlighted: boolean;
}
interface ItemGroupProps {
    id: string;
}
interface ItemGroupLabelProps {
    htmlFor: string;
}
interface ComboboxApi<T extends PropTypes = PropTypes, V extends CollectionItem = CollectionItem> {
    /**
     * Whether the combobox is focused
     */
    focused: boolean;
    /**
     * Whether the combobox is open
     */
    open: boolean;
    /**
     * The value of the combobox input
     */
    inputValue: string;
    /**
     * The value of the highlighted item
     */
    highlightedValue: string | null;
    /**
     * The highlighted item
     */
    highlightedItem: V | null;
    /**
     * The value of the combobox input
     */
    setHighlightValue(value: string): void;
    /**
     * Function to sync the selected items with the value.
     * Useful when `value` is updated from async sources.
     */
    syncSelectedItems(): void;
    /**
     * The selected items
     */
    selectedItems: V[];
    /**
     * Whether there's a selected item
     */
    hasSelectedItems: boolean;
    /**
     * The selected item keys
     */
    value: string[];
    /**
     * The string representation of the selected items
     */
    valueAsString: string;
    /**
     * Function to select a value
     */
    selectValue(value: string): void;
    /**
     * Function to set the value of the combobox
     */
    setValue(value: string[]): void;
    /**
     * Function to clear the value of the combobox
     */
    clearValue(value?: string): void;
    /**
     * Function to focus on the combobox input
     */
    focus(): void;
    /**
     * Function to set the input value of the combobox
     */
    setInputValue(value: string): void;
    /**
     * Returns the state of a combobox item
     */
    getItemState(props: ItemProps): ItemState;
    /**
     * Function to open or close the combobox
     */
    setOpen(open: boolean): void;
    /**
     * Function to toggle the combobox
     */
    collection: ListCollection<V>;
    /**
     * Function to set the positioning options
     */
    reposition(options?: Partial<PositioningOptions>): void;
    /**
     * Whether the combobox allows multiple selections
     */
    multiple: boolean;
    /**
     * Whether the combobox is disabled
     */
    disabled: boolean;
    getRootProps(): T["element"];
    getLabelProps(): T["label"];
    getControlProps(): T["element"];
    getPositionerProps(): T["element"];
    getInputProps(): T["input"];
    getContentProps(): T["element"];
    getTriggerProps(props?: TriggerProps): T["button"];
    getClearTriggerProps(): T["button"];
    getListProps(): T["element"];
    getItemProps(props: ItemProps): T["element"];
    getItemTextProps(props: ItemProps): T["element"];
    getItemIndicatorProps(props: ItemProps): T["element"];
    getItemGroupProps(props: ItemGroupProps): T["element"];
    getItemGroupLabelProps(props: ItemGroupLabelProps): T["element"];
}

declare function connect<T extends PropTypes, V extends CollectionItem>(service: ComboboxService<V>, normalize: NormalizeProps<T>): ComboboxApi<T, V>;

declare const machine: _zag_js_core.Machine<ComboboxSchema<any>>;

declare const props: (keyof ComboboxProps<any>)[];
declare const splitProps: <Props extends Partial<ComboboxProps<any>>>(props: Props) => [Partial<ComboboxProps<any>>, Omit<Props, keyof ComboboxProps<any>>];
declare const itemGroupLabelProps: "htmlFor"[];
declare const splitItemGroupLabelProps: <Props extends ItemGroupLabelProps>(props: Props) => [ItemGroupLabelProps, Omit<Props, "htmlFor">];
declare const itemGroupProps: "id"[];
declare const splitItemGroupProps: <Props extends ItemGroupProps>(props: Props) => [ItemGroupProps, Omit<Props, "id">];
declare const itemProps: (keyof ItemProps)[];
declare const splitItemProps: <Props extends ItemProps>(props: Props) => [ItemProps, Omit<Props, keyof ItemProps>];

export { type ComboboxApi as Api, type ElementIds, type HighlightChangeDetails, type InputValueChangeDetails, type IntlTranslations, type ItemGroupLabelProps, type ItemGroupProps, type ItemProps, type ItemState, type ComboboxMachine as Machine, type NavigateDetails, type OpenChangeDetails, type ComboboxProps as Props, type ScrollToIndexDetails, type ComboboxService as Service, type TriggerProps, type ValueChangeDetails, anatomy, collection, connect, itemGroupLabelProps, itemGroupProps, itemProps, machine, props, splitItemGroupLabelProps, splitItemGroupProps, splitItemProps, splitProps };
