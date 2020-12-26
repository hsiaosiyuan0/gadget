import { defer, Deferred, on, emit, off } from "../../shared";
import { NS, EVT_MODULE_LOADED } from "../config/constant";
import { IS_CLIENT } from "../config";

export type ModuleMeta = {
  files: string[];
  exports?: { default: any };
};
const deferredModules = new Map<string, ModuleMeta>();

/**
 * @browser
 * @param id
 * @param cb
 */
export function waitModuleLoaded(id: string, cb: (module: any) => void) {
  const meta = deferredModules.get(normalizeId(id));
  if (meta?.exports) cb(meta.exports);
  const handler = (loadedId: string, module: any) => {
    if (id === loadedId) {
      off(EVT_MODULE_LOADED, handler);
      cb(module);
    }
  };
  on(EVT_MODULE_LOADED, handler);
}

function markModuleLoaded(id: string, module: any) {
  const meta = deferredModules.get(id);
  meta!.exports = module;
}

function emitModuleLoadedEvent(id: string, module: any) {
  emit(EVT_MODULE_LOADED, id, module);
}

function handleModuleLoaded(loaded: [string, any]) {
  const [id, moduleFactory] = loaded;
  const module = moduleFactory();
  markModuleLoaded(id, module);
  emitModuleLoadedEvent(id, module);
}

if (IS_CLIENT()) {
  function restoreModules() {
    const raw = (window as any)[NS].pageModules as Record<string, string[]>;
    Object.keys(raw).forEach((k) => deferredModules.set(k, { files: raw[k] }));

    // forcedly replace the `push` method on the array to be `handleModuleLoaded`,
    // doing this for the later loaded module can register themselves directly
    // into `deferredModules`
    (raw as any).push = handleModuleLoaded;
  }

  restoreModules();
}

const loadingScripts: Map<string, Deferred<boolean>> = new Map();

/**
 * @browser
 * @param url
 */
export async function loadScript(url: string) {
  if (loadingScripts.has(url)) {
    return loadingScripts.get(url);
  }

  const deferred = defer<boolean>();
  loadingScripts.set(url, deferred);

  const exist = document.querySelector(`script[src="${url}"]`);
  if (exist) {
    deferred.done(true);
    return deferred.promise;
  }

  const script = document.createElement("script");
  script.src = url;
  script.crossOrigin = "anonymous";
  script.onerror = () => {
    loadingScripts.delete(url);
    deferred.done(false);
  };
  script.onload = () => {
    deferred.done(true);
  };
  document.body.appendChild(script);
  return deferred.promise;
}

const loadingStyles: Map<string, Deferred<boolean>> = new Map();
/**
 * @browser
 * @param url
 */
export async function loadStyle(url: string) {
  if (loadingStyles.has(url)) {
    return loadingStyles.get(url);
  }

  const deferred = defer<boolean>();
  loadingStyles.set(url, deferred);

  const exist = document.querySelector(`link[rel=stylesheet][href="${url}"]`);
  if (exist) {
    deferred.done(true);
    return deferred.promise;
  }

  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  link.onerror = () => {
    loadingStyles.delete(url);
    deferred.done(false);
  };
  link.onload = () => {
    deferred.done(true);
  };
  document.getElementsByTagName("head")[0].appendChild(link);
  return deferred.promise;
}

function normalizeId(id: string) {
  const keys = deferredModules.keys();
  for (const key of keys) {
    if (key.includes("*") && new RegExp(key).test(id)) return key;
    if (id === key || id + "/index" === key) return key;
  }
  throw new Error("unexpected module id: " + id);
}

/**
 * @browser
 * @param id
 */
export async function loadModule(id: string) {
  const moduleId = normalizeId(id);
  const meta = deferredModules.get(moduleId);
  if (!meta) throw new Error(`no module info for id: ${id}`);

  const deferred = defer<{}>();

  if (meta.exports) {
    deferred.done(meta.exports);
  } else {
    function handleModuleLoaded(loadedId: string, module: any) {
      if (loadedId === moduleId || loadedId + "/*" === moduleId) {
        if (moduleId.includes("*")) {
          meta!.exports = module;
          emitModuleLoadedEvent(id, module);
        }
        off(EVT_MODULE_LOADED, handleModuleLoaded);
        deferred.done(module);
      }
    }
    on(EVT_MODULE_LOADED, handleModuleLoaded);

    const loadings = meta.files.map((f) =>
      f.endsWith(".js") ? loadScript(f) : loadStyle(f)
    );
    const ok = (await Promise.all(loadings)).every((v) => v);
    if (!ok) throw new Error(`failed to load module script: ${id}`);
  }

  return deferred.promise;
}

export function retrievePageModule(route: string) {
  return deferredModules.get(route);
}
