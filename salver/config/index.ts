import { merge } from "../../shared";
import { NS } from "./constant";

function duaGlobal() {
  const g = typeof global !== undefined ? global : window;
  return g as any;
}

export function IS_SERVER() {
  return !!duaGlobal().SERVER;
}

export function IS_CLIENT() {
  return !IS_SERVER();
}

export function useModule(name: string, module: any) {
  const fn = duaGlobal().useModule;
  if (typeof fn === "function") {
    fn(name, module);
  }
}

export function setTitle(title: string) {
  const fn = duaGlobal().setTitle;
  if (typeof fn === "function") {
    fn(title);
  }
}

export interface Config {
  initialProps: any;
  mnt: string;
  baseUrl: string;
  router: {
    hash: boolean;
    basename: string;
    routes: Array<string>;
    rewrites: Array<[string, string]>;
  };
  pages: Array<[string, string[]]>;
}

const defaultConfig: Config = {
  initialProps: {},
  mnt: NS,
  baseUrl: "ssr:///",
  router: {
    hash: false,
    basename: "/",
    routes: [],
    rewrites: [],
  },
  pages: [],
};

const _config: Config = {} as any;
let presetCfg: any = {};
if (IS_SERVER()) {
  // preCfg will be injected by runtime-server
  const c = (global as any)[NS];
  Object.keys(defaultConfig).forEach((k) => {
    if (c[k]) presetCfg[k] = c[k];
  });
} else {
  defaultConfig.baseUrl = window.location.origin;
  presetCfg = (window as any)[NS];
  if (!presetCfg) throw new Error("Missing configuration");
}

merge(_config, defaultConfig);
merge(_config, presetCfg);

_config.pages.forEach(([route]) => {
  _config.router.routes.push(route);
});

export function hasRoute(route: string) {
  const match = !!_config.router.routes.find((r) => {
    if (r.includes("*")) return new RegExp(r).test(route);
    return r === route || route + "/index" === r;
  });
  return match;
}

export function isHashMode() {
  return _config.router.hash;
}

export function initialProps() {
  return _config.initialProps;
}

export function mountPoint() {
  return _config.mnt;
}

export function basename() {
  return _config.router.basename || "/";
}

export function config() {
  return _config;
}

export * from "./constant";
