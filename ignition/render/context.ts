import path from "path";
import { newContext } from "./launch";

export function prepareRenderCtx(outputPath: string) {
  const ctx = newContext();

  const manifestFile = path.join(outputPath, "route-assoc-files.json");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const manifest = require(manifestFile);

  ctx.baseModules = mapModules(manifest.base, (pth) =>
    toAbsPath(pth, outputPath)
  );
  ctx.pageModules = mapModules(manifest.pages, (pth) =>
    toAbsPath(pth, outputPath)
  );

  ctx.router = {
    basename: process.env.BASE_NAME ?? "/",
    routes: Object.keys(ctx.pageModules),
  };

  return ctx;
}

export const mapModules = (
  modules: { [k: string]: string[] },
  transformer: (file: string) => string
) => {
  const ret: typeof modules = {};
  Object.keys(modules).forEach((k) => {
    ret[k] = modules[k].map((f) => transformer(f));
  });
  return ret;
};

export const toAbsPath = (pth: string, root: string) => {
  if (pth.startsWith("/")) return pth;
  return path.join(root, pth);
};
