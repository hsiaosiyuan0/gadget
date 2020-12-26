export interface Deferred<T> {
    done: (valueOrReason: T | Error) => void;
    promise: Promise<T | Error>;
}
export declare type Resolve<T> = (value?: T | PromiseLike<T>) => void;
export declare type Reject = (reason?: any) => void;
/**
 * create an new deferred object
 */
export declare function defer<T>(): Deferred<T>;
