export interface Deferred<T> {
  done: (valueOrReason: T | Error) => void;
  promise: Promise<T | Error>;
}

export type Resolve<T> = (value?: T | PromiseLike<T>) => void;
export type Reject = (reason?: any) => void;

/**
 * create an new deferred object
 */
export function defer<T>(): Deferred<T> {
  let resolve: Resolve<T>;
  let reject: Reject;
  const promise = new Promise<T>((r1: any, r2: any) => {
    resolve = r1;
    reject = r2;
  });
  return {
    done(valueOrReason: T | Error) {
      if (valueOrReason instanceof Error) {
        reject(valueOrReason);
        return;
      }
      resolve(valueOrReason);
    },
    promise,
  };
}
