import fs from "fs";
import path from "path";
import yml from "yaml";
import mkdir from "mkdirp";
import { get } from "lodash";
import { fatal } from "./util";
import { fileExists, isDir } from "../util";

const cfgName = "gadget.yml";
export const gadgetDirname = ".gadget";

export function configFilePath(cwd = process.cwd()) {
  return path.join(cwd, cfgName);
}

let cfg: any = null;
export async function config() {
  if (cfg !== null) return cfg;

  if (!(await fileExists(configFilePath()))) {
    cfg = {
      title: "Gadget",
      template: defaultTpl,
    };
    await fs.promises.writeFile(configFilePath(), yml.stringify(cfg));
    return cfg;
  }

  let src = "";
  try {
    src = (await fs.promises.readFile(configFilePath())).toString();
  } catch (error) {
    fatal("Unable to read gadget.yml: " + error);
  }

  try {
    cfg = yml.parse(src);
    return cfg;
  } catch (error) {
    fatal("Deformed content in gadget.yml: " + error);
  }
}

export async function getConfig<T = any>(
  key: string,
  defaultValue: T
): Promise<T> {
  return get(await config(), key, defaultValue) as any;
}

const defaultTpl = "https://github.com/hsiaosiyuan0/gadget-md.git";
export async function template() {
  return getConfig<string>("template", defaultTpl);
}

export async function templateDirname() {
  return path.parse(await template()).name;
}

export async function templateAbsPath() {
  return path.join(process.cwd(), gadgetDirname, await templateDirname());
}

export async function ensureGadgetDir() {
  const dir = path.join(process.cwd(), gadgetDirname);
  const exists = await fileExists(path.join(process.cwd(), gadgetDirname));
  if (exists) {
    if (await isDir(dir)) return;
    fatal(`${dir} is not a directory`);
  }
  return mkdir(dir);
}
