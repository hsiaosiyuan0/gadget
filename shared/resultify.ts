export type Success<T> = { r: T; e: null; take: () => T };
export type Failure<E> = { r: null; e: E; take: () => never };

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function resultify<T, E = Error>(
  p: Promise<T> | (() => T),
): Promise<Result<T, E>> {
  if (p instanceof Promise) {
    return p
      .then((r) => {
        return { r, e: null, take: () => r };
      })
      .catch((e) => {
        return {
          r: null,
          e,
          take: () => {
            throw e;
          },
        };
      });
  }
  try {
    const r = p();
    return Promise.resolve({ r, e: null, take: () => r });
  } catch (e) {
    return Promise.resolve({
      r: null,
      e,
      take: () => {
        throw e;
      },
    });
  }
}
