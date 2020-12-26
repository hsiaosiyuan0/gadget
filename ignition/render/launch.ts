import * as path from "path";
import { fileExists } from "../util";
import { RenderContext, Manifest, ModuleMeta } from "./types";

const NS = "__gadget__";

function g() {
  return global as any;
}

export function renderContext() {
  return g()[NS] as RenderContext;
}

export function newContext() {
  const ctx: RenderContext = {
    root: "",
    publicPath: "/",
    currentRoute: { pattern: "/", href: { pathname: "/" } },

    bundleDir: "",
    baseModules: {},
    pageModules: {},

    router: { routes: [] },
    request: {} as any,
    manifest: {} as any,
    outlet: null,
  };
  g()[NS] = ctx;
  return ctx;
}

export function debug() {
  return process.env.DEBUG;
}

const deferredModules = new Map<string, ModuleMeta>();
function loadPageModules() {
  const ctx = renderContext();
  const raw = ctx.pageModules;
  Object.entries(raw).forEach((r) => {
    if (r[1]) deferredModules.set(r[0], { files: r[1] });
  });

  (raw as any).push = (loaded: [string, any]) => {
    const [id, moduleFactory] = loaded;
    let meta = deferredModules.get(id);
    if (!meta) {
      meta = {
        files: [],
      };
      deferredModules.set(id, meta);
    }
    meta.exports = moduleFactory();
  };

  Object.entries(raw).forEach((r) => {
    // skip above `push` method
    if (!Array.isArray(r[1])) return;

    r[1].forEach((f) => {
      if (f.endsWith(".js")) {
        const target = path.join(ctx.bundleDir, f);
        if (debug()) delete require.cache[target];
        require(target);
      }
    });
  });
}

export function loadBaseModules() {
  const ctx = renderContext();
  Object.values(ctx.baseModules).forEach((m) =>
    m?.forEach((f) => {
      if (f.endsWith(".js")) {
        const target = path.join(ctx.bundleDir, f);
        if (debug()) delete require.cache[target];
        require(target);
      }
    })
  );
}

export function retrieveModule(route: string) {
  return deferredModules.get(route);
}

function normalizePublicUrl(u: string) {
  if (u.endsWith("/")) return u;
  return u + "/";
}

const clientModules: Record<string, any> = {};
export function getClientModule(name: string) {
  return clientModules[name];
}

function setupAppContext(bundle: string) {
  const dir = path.join(bundle);

  // for UI
  g().SERVER = true;
  g().DEBUG = debug();
  g().useModule = (name: string, m: any) => {
    clientModules[name] = m;
  };

  const manifestFile = path.join(dir, "manifest.json");
  if (debug()) delete require.cache[dir];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const manifest: Manifest = require(manifestFile);
  const ctx = newContext();
  ctx.root = bundle;
  ctx.publicPath = normalizePublicUrl(
    process.env.PUBLIC_URL ? path.resolve(process.env.PUBLIC_URL, "/") : "/"
  );

  ctx.bundleDir = dir;
  ctx.manifest = manifest;

  ctx.baseModules = manifest.base;
  ctx.pageModules = manifest.pages;

  ctx.router = {
    basename: process.env.BASE_NAME ?? "/",
    routes: Object.keys(ctx.pageModules),
  };

  loadBaseModules();
  loadPageModules();
}

export async function launch(bundle: string) {
  const stuff = path.join(bundle);
  if (!(await fileExists(stuff))) {
    throw new Error("No file to launch: " + stuff);
  }
  setupAppContext(bundle);
}
