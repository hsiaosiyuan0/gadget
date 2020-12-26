export declare function isObjEqual(o1?: {
    [k: string]: any;
}, o2?: {
    [k: string]: any;
}): boolean;
export declare function uniqueArray<T>(...args: Array<T[]>): T[];
export declare type Nullable<T> = T | null | undefined;
export declare function isObject(o: any): any;
export declare function merge(to: {
    [k: string]: any;
}, from: {
    [k: string]: any;
}): void;
export declare function trim(str: string, terminators: string[]): string;
export declare function trimLeft(str: string, terminators: string[]): string;
export declare function trimRight(str: string, terminators: string[]): string;
export declare type ElementOf<T> = T extends Array<infer E> ? E : never;
export declare function assertValueInEnum(value: any, enumValues: any[]): any;
export declare function classNames(names: string[]): string;
export declare function packToArray<T>(stuff?: T | Array<T>): Array<T>;
export declare type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
export * from "./defer";
export * from "./evt-bus";
export * from "./resultify";
export * from "./url";
