import { interpolateName } from "loader-utils";

export function newNameResolver(ctx: any, options?: any) {
  return function (pattern: string) {
    return interpolateName(ctx, pattern, options);
  };
}
