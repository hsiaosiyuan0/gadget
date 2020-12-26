import path from "path";
import fs from "fs";
import yaml from "yaml";

export type StringDict = Record<string, string>;

const loaderMap: Record<string, string> = {};

export function registerLoader(id: string, path: string) {
  const old = loaderMap[id];
  if (old && old !== path) {
    console.warn(
      `registered loader [${id}] with path [${old}] will be replaced by ${path}`
    );
  }
  loaderMap[id] = path;
}

export function retrieveLoaders() {
  return loaderMap;
}

/**
 * just a convenience wrapper of `registerLoader`, callers just needs to
 * specify the module id which wanted to be used as an alias, this method
 * firstly use `require.resolve` to resolve the path of that module then
 * add it into the internal `loaderMap` for later use.
 */
export function useInternalLoader(id: string) {
  const path = require.resolve(id);
  registerLoader(id, path);
}

export function builtinModule(id: string) {
  return require.resolve(id);
}

export function requireInternalModule(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(id);
}

const internalModules: StringDict = {};
export function useInternalModule(id: string) {
  const old = internalModules[id];
  const p = path.parse(require.resolve(id)).dir;
  if (old && old !== p) {
    console.warn(
      `registered internal module [${id}] with path [${old}] will be replaced by ${path}`
    );
  }
  internalModules[id] = p;
}

export function retrieveInternalModules() {
  return internalModules;
}

export function clientRuntimeModulePath() {
  return path.parse(require.resolve("gadget", { paths: [process.cwd()] })).dir;
}

export function useInternalFile(id: string) {
  return require.resolve(`../${id}`);
}

export function useInternalRuntimeFile(id: string) {
  return path.resolve(clientRuntimeModulePath(), id);
}

export async function findExistPaths(paths: string[]) {
  for (const pth of paths) {
    try {
      await fs.promises.access(pth, fs.constants.R_OK);
      return pth;
    } catch (error) {
      // ignore error
    }
  }
  return null;
}

export async function readYaml({
  file,
  text,
  silent = true,
}: {
  file?: string;
  text?: string;
  silent?: boolean;
}) {
  if (file) {
    try {
      text = (await fs.promises.readFile(file)).toString();
    } catch (error) {
      if (silent) text = "";
      else throw error;
    }
  }
  return yaml.parse(text!);
}
