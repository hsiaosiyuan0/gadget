export function isObjEqual(
  o1?: { [k: string]: any },
  o2?: { [k: string]: any }
) {
  if (!o1 || !o2) return o1 === o2;

  const ks1 = Object.keys(o1);
  const ks2 = Object.keys(o2);
  return (ks1.length > ks2.length ? ks1 : ks2).every(
    (ok1) => o2[ok1] === o1[ok1]
  );
}

export function uniqueArray<T>(...args: Array<T[]>): T[] {
  let items: T[] = [];
  args.forEach((arg) => (items = items.concat(arg)));
  return Array.from(new Set(items));
}

export type Nullable<T> = T | null | undefined;

export function isObject(o: any) {
  return o && typeof o === "object";
}

export function merge(to: { [k: string]: any }, from: { [k: string]: any }) {
  Object.keys(from).forEach((k2) => {
    if (isObject(from[k2])) {
      if (!isObject(to[k2])) {
        to[k2] = Array.isArray(from[k2]) ? [] : {};
      }
      merge(to[k2], from[k2]);
    } else {
      to[k2] = from[k2];
    }
  });
}

export function trim(str: string, terminators: string[]) {
  let i = 0;
  let j = str.length - 1;

  while (i <= j) {
    let goon = false;
    if (terminators.includes(str[i])) {
      i++;
      goon = true;
    }
    if (terminators.includes(str[j])) {
      j--;
      goon = true;
    }
    if (!goon) break;
  }

  if (i > j) return "";
  return str.slice(i, j + 1);
}

export function trimLeft(str: string, terminators: string[]) {
  let i = 0;
  const len = str.length;
  for (; i < len; i++) {
    if (!terminators.includes(str[i])) break;
  }
  return str.slice(i);
}

export function trimRight(str: string, terminators: string[]) {
  const len = str.length;
  let i = len - 1;
  for (; i >= 0; i--) {
    if (!terminators.includes(str[i])) break;
  }
  return str.slice(0, i + 1);
}

export type ElementOf<T> = T extends Array<infer E> ? E : never;

export function assertValueInEnum(value: any, enumValues: any[]) {
  const ok = enumValues.includes(value);
  if (ok) return value;
  throw new Error(`${value} is not in Enum [${enumValues.join(", ")}]`);
}

export function classNames(names: string[]) {
  return names.filter((n) => !!n).join(" ");
}

export function packToArray<T>(stuff?: T | Array<T>): Array<T> {
  if (stuff === undefined) return [];
  if (Array.isArray(stuff)) return stuff;
  return [stuff];
}

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export * from "./defer";
export * from "./evt-bus";
export * from "./resultify";
export * from "./url";
