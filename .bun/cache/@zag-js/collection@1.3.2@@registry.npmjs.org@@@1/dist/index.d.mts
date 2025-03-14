interface CollectionSearchState {
    keysSoFar: string;
    timer: number;
}
interface CollectionSearchOptions {
    state: CollectionSearchState;
    currentValue: string | null;
    timeout?: number | undefined;
}
type CollectionItem = any;
interface CollectionMethods<T extends CollectionItem = CollectionItem> {
    /**
     * The value of the item
     */
    itemToValue: (item: T) => string;
    /**
     * The label of the item
     */
    itemToString: (item: T) => string;
    /**
     * Whether the item is disabled
     */
    isItemDisabled: (item: T) => boolean;
}
interface CollectionOptions<T extends CollectionItem = CollectionItem> extends Partial<CollectionMethods<T>> {
    /**
     * The options of the select
     */
    items: Iterable<T> | Readonly<Iterable<T>>;
}
interface TreeCollectionMethods<T> {
    isNodeDisabled: (node: T) => boolean;
    nodeToValue: (node: T) => string;
    nodeToString: (node: T) => string;
    nodeToChildren: (node: T) => any[];
}
interface TreeCollectionOptions<T> extends Partial<TreeCollectionMethods<T>> {
    rootNode: T;
}
type TreeNode = any;
interface FilePathTreeNode {
    label: string;
    value: string;
    children?: FilePathTreeNode[];
}
interface FlatTreeNode {
    label?: string | undefined;
    value: string;
    indexPath: number[];
    children?: string[] | undefined;
}
interface TreeSkipFnArgs<T> {
    value: string;
    node: T;
    indexPath: number[];
}
type TreeSkipFn<T> = (args: TreeSkipFnArgs<T>) => boolean | void;
interface TreeSkipOptions<T> {
    skip?: TreeSkipFn<T>;
}

declare class ListCollection<T extends CollectionItem = CollectionItem> {
    private options;
    /**
     * The items in the collection
     */
    items: T[];
    constructor(options: CollectionOptions<T>);
    isEqual: (other: ListCollection<T>) => boolean;
    /**
     * Function to update the collection items
     */
    setItems: (items: T[] | readonly T[]) => void;
    /**
     * Returns all the values in the collection
     */
    getValues: (items?: T[]) => string[];
    /**
     * Get the item based on its value
     */
    find: (value: string | null | undefined) => T | null;
    /**
     * Get the items based on its values
     */
    findMany: (values: string[]) => T[];
    /**
     * Get the item based on its index
     */
    at: (index: number) => T | null;
    private sortFn;
    /**
     * Sort the values based on their index
     */
    sort: (values: string[]) => string[];
    /**
     * Convert an item to a value
     */
    getItemValue: (item: T | null | undefined) => string | null;
    /**
     * Whether an item is disabled
     */
    getItemDisabled: (item: T | null) => boolean;
    /**
     * Convert an item to a string
     */
    stringifyItem: (item: T | null) => string | null;
    /**
     * Convert a value to a string
     */
    stringify: (value: string | null) => string | null;
    /**
     * Convert an array of items to a string
     */
    stringifyItems: (items: T[], separator?: string) => string;
    /**
     * Convert an array of items to a string
     */
    stringifyMany: (value: string[], separator?: string) => string;
    /**
     * Whether the collection has a value
     */
    has: (value: string | null) => boolean;
    /**
     * Whether the collection has an item
     */
    hasItem: (item: T | null) => boolean;
    /**
     * Returns the number of items in the collection
     */
    get size(): number;
    /**
     * Returns the first value in the collection
     */
    get firstValue(): string | null;
    /**
     * Returns the last value in the collection
     */
    get lastValue(): string | null;
    /**
     * Returns the next value in the collection
     */
    getNextValue: (value: string, step?: number, clamp?: boolean) => string | null;
    /**
     * Returns the previous value in the collection
     */
    getPreviousValue: (value: string, step?: number, clamp?: boolean) => string | null;
    /**
     * Get the index of an item based on its key
     */
    indexOf: (value: string | null) => number;
    private getByText;
    /**
     * Search for a value based on a query
     */
    search: (queryString: string, options: CollectionSearchOptions) => string | null;
    [Symbol.iterator](): Generator<T, void, unknown>;
    insertBefore: (value: string, item: T) => void;
    insertAfter: (value: string, item: T) => void;
    reorder: (fromIndex: number, toIndex: number) => void;
    toJSON: () => {
        size: number;
        first: string | null;
        last: string | null;
    };
}

interface GridCollectionOptions<T> extends CollectionOptions<T> {
    columnCount: number;
}
declare class GridCollection<T extends CollectionItem = CollectionItem> extends ListCollection<T> {
    columnCount: number;
    constructor(options: GridCollectionOptions<T>);
    /**
     * Returns the row data in the grid
     */
    getRows: () => T[][];
    /**
     * Returns the number of rows in the grid
     */
    getRowCount: () => number;
    /**
     * Returns the index of the specified row and column in the grid
     */
    getCellIndex: (row: number, column: number) => number;
    /**
     * Returns the item at the specified row and column in the grid
     */
    getCell: (row: number, column: number) => T | null;
    /**
     * Returns the value of the previous row in the grid, based on the current value
     */
    getPreviousRowValue: (value: string, clamp?: boolean) => string | null;
    /**
     * Returns the value of the next row in the grid, based on the current value
     */
    getNextRowValue: (value: string, clamp?: boolean) => string | null;
}

type IndexPath = number[];
interface BaseOptions<T> {
    getChildren: (node: T, indexPath: IndexPath) => T[];
    reuseIndexPath?: boolean;
}
type TreeVisitEnterReturnValue = void | "skip" | "stop";
type TreeVisitLeaveReturnValue = void | "stop";
interface TreeVisitOptions<T> extends BaseOptions<T> {
    onEnter?(node: T, indexPath: IndexPath): TreeVisitEnterReturnValue;
    onLeave?(node: T, indexPath: IndexPath): TreeVisitLeaveReturnValue;
}

declare class TreeCollection<T = TreeNode> {
    private options;
    rootNode: T;
    constructor(options: TreeCollectionOptions<T>);
    isEqual: (other: TreeCollection<T>) => boolean;
    getNodeChildren: (node: T) => T[];
    getNodeValue: (node: T) => string;
    getNodeDisabled: (node: T) => boolean;
    stringify: (value: string) => string | null;
    stringifyNode: (node: T) => string;
    getFirstNode: (rootNode?: T) => T | undefined;
    getLastNode: (rootNode?: T, opts?: TreeSkipOptions<T>) => T | undefined;
    at: (indexPath: IndexPath) => T | undefined;
    findNode: (value: string, rootNode?: T) => T | undefined;
    sort: (values: string[]) => string[];
    getIndexPath: (value: string) => IndexPath | undefined;
    getValue: (indexPath: IndexPath) => string | undefined;
    getValuePath: (indexPath: IndexPath | undefined) => string[];
    getDepth: (value: string) => number;
    isRootNode: (node: T) => boolean;
    contains: (parentIndexPath: IndexPath, valueIndexPath: IndexPath) => boolean;
    getNextNode: (value: string, opts?: TreeSkipOptions<T>) => T | undefined;
    getPreviousNode: (value: string, opts?: TreeSkipOptions<T>) => T | undefined;
    getParentNodes: (values: string) => T[];
    private getParentIndexPath;
    getParentNode: (valueOrIndexPath: string | IndexPath) => T | undefined;
    visit: (opts: Omit<TreeVisitOptions<T>, "getChildren"> & TreeSkipOptions<T>) => void;
    getPreviousSibling: (indexPath: IndexPath) => T | undefined;
    getNextSibling: (indexPath: IndexPath) => T | undefined;
    getSiblingNodes: (indexPath: IndexPath) => T[];
    getValues: (rootNode?: T) => string[];
    private isSameDepth;
    isBranchNode: (node: T) => boolean;
    getBranchValues: (rootNode?: T, opts?: TreeSkipOptions<T> & {
        depth?: number;
    }) => string[];
    flatten: (rootNode?: T) => FlatTreeNode[];
    private _create;
    private _insert;
    private _replace;
    private _move;
    private _remove;
    replace: (indexPath: IndexPath, node: T) => T;
    remove: (indexPaths: IndexPath[]) => T;
    insertBefore: (indexPath: IndexPath, nodes: T[]) => T | undefined;
    insertAfter: (indexPath: IndexPath, nodes: T[]) => T | undefined;
    move: (fromIndexPaths: IndexPath[], toIndexPath: IndexPath) => T;
    toJSON: () => string[];
}
declare function flattenedToTree(nodes: FlatTreeNode[]): TreeCollection<{
    value: string;
}>;
declare function filePathToTree(paths: string[]): TreeCollection<FilePathTreeNode>;

export { type CollectionItem, type CollectionMethods, type CollectionOptions, type CollectionSearchOptions, type CollectionSearchState, type FilePathTreeNode, type FlatTreeNode, GridCollection, type GridCollectionOptions, ListCollection, TreeCollection, type TreeCollectionMethods, type TreeCollectionOptions, type TreeNode, type TreeSkipFn, filePathToTree, flattenedToTree };
