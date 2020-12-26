export declare type Success<T> = {
    r: T;
    e: null;
    take: () => T;
};
export declare type Failure<E> = {
    r: null;
    e: E;
    take: () => never;
};
export declare type Result<T, E = Error> = Success<T> | Failure<E>;
export declare function resultify<T, E = Error>(p: Promise<T> | (() => T)): Promise<Result<T, E>>;
