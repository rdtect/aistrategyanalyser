import * as errors from "./errors/index";
import type { Codecs } from "./codecs/codecs";
import type { ReadonlyCodecMap } from "./codecs/context";
import { CodecContext } from "./codecs/context";
export type BackoffFunction = (n: number) => number;
export declare function defaultBackoff(attempt: number): number;
export declare enum IsolationLevel {
    Serializable = "SERIALIZABLE",
    RepeatableRead = "REPEATABLE READ"
}
export declare enum RetryCondition {
    TransactionConflict = 0,
    NetworkError = 1
}
declare class RetryRule {
    readonly attempts: number;
    readonly backoff: BackoffFunction;
    constructor(attempts: number, backoff: BackoffFunction);
}
export interface PartialRetryRule {
    condition?: RetryCondition;
    attempts?: number;
    backoff?: BackoffFunction;
}
export interface SimpleRetryOptions {
    attempts?: number;
    backoff?: BackoffFunction;
}
export type WarningHandler = (warnings: errors.GelError[]) => void;
export declare function throwWarnings(warnings: errors.GelError[]): void;
export declare function logWarnings(warnings: errors.GelError[]): void;
export declare class RetryOptions {
    readonly default: RetryRule;
    private overrides;
    constructor(attempts?: number, backoff?: BackoffFunction);
    withRule(condition: RetryCondition, attempts?: number, backoff?: BackoffFunction): RetryOptions;
    getRuleForException(err: errors.GelError): RetryRule;
    static defaults(): RetryOptions;
}
export interface SimpleTransactionOptions {
    isolation?: IsolationLevel;
    readonly?: boolean;
    deferrable?: boolean;
}
export declare class TransactionOptions {
    readonly isolation: IsolationLevel;
    readonly readonly: boolean;
    readonly deferrable: boolean;
    constructor({ isolation, readonly, deferrable, }?: SimpleTransactionOptions);
    static defaults(): TransactionOptions;
}
export interface SerializedSessionState {
    module?: string;
    aliases?: [string, string][];
    config?: {
        [name: string]: unknown;
    };
    globals?: {
        [name: string]: unknown;
    };
}
export interface CodecSpec {
    encode: (data: any) => any;
    decode: (data: any) => any;
}
export type OptionsList = {
    module?: string;
    moduleAliases?: Record<string, string>;
    config?: Record<string, any>;
    globals?: Record<string, any>;
    retryOptions?: RetryOptions;
    transactionOptions?: TransactionOptions;
    warningHandler?: WarningHandler;
    codecs?: Codecs.CodecSpec;
};
export declare class Options {
    private static schemaVersion;
    readonly module: string;
    readonly moduleAliases: ReadonlyMap<string, string>;
    readonly config: ReadonlyMap<string, any>;
    readonly globals: ReadonlyMap<string, any>;
    readonly retryOptions: RetryOptions;
    readonly transactionOptions: TransactionOptions;
    readonly codecs: ReadonlyCodecMap;
    readonly warningHandler: WarningHandler;
    get tag(): string | null;
    static signalSchemaChange(): void;
    constructor({ retryOptions, transactionOptions, warningHandler, module, moduleAliases, config, globals, codecs, }?: OptionsList);
    makeCodecContext(): CodecContext;
    private _cloneWith;
    withModuleAliases({ module, ...aliases }: {
        [name: string]: string;
    }): Options;
    withConfig(config: Record<string, any>): Options;
    withCodecs(codecs: Codecs.CodecSpec): Options;
    withSQLRowMode(mode: "array" | "object"): Options;
    withGlobals(globals: Record<string, any>): Options;
    withQueryTag(tag: string | null): Options;
    withTransactionOptions(opt: TransactionOptions | SimpleTransactionOptions): Options;
    withRetryOptions(opt: RetryOptions | SimpleRetryOptions): Options;
    withWarningHandler(handler: WarningHandler): Options;
    isDefaultSession(): boolean;
    static defaults(): Options;
}
export {};
