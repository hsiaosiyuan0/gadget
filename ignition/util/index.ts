import * as fs from "fs";

export async function fileExists(f: string) {
  try {
    await fs.promises.access(f, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function findExistPath(paths: string[]) {
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
