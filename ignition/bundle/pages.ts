import fs from "fs";
import path from "path";

export interface PageInfo {
  name: string;
  path: string;
  ext: string;
  route: string;
}

export const rPageName = /^[a-z0-9-][a-z0-9-_]*$/;
export const rPageExt = /^\.?(tsx?|jsx?)$/;

export function isDataFile(filename: string) {
  return filename.endsWith(".data.ts") || filename.endsWith(".data.js");
}

export function isValidatePage(name: string, ext: string) {
  return rPageName.test(name) && rPageExt.test(ext) && !isDataFile(name);
}

async function _collectPages(
  root: string,
  curDir: string,
  out: PageInfo[],
  invalid: PageInfo[],
  depth = 1,
  maxDepth = 10,
  raiseError = true
) {
  if (depth > maxDepth && raiseError) {
    throw new Error(
      "your pages' depth exceeds the max depth limitation: " + maxDepth
    );
  }

  const subFiles = await fs.promises.readdir(curDir, { withFileTypes: true });
  for (const file of subFiles) {
    const pathname = path.join(curDir, file.name);
    if (file.isDirectory()) {
      const { name } = path.parse(pathname);
      if (name.startsWith("_")) continue;

      await _collectPages(
        root,
        pathname,
        out,
        invalid,
        depth + 1,
        maxDepth,
        raiseError
      );
    } else {
      const { name, ext } = path.parse(pathname);
      const relativePath = pathname.replace(root, "");
      const info = {
        name,
        path: relativePath,
        ext,
        route: relativePath.replace(ext, ""),
      };
      if (isValidatePage(name, ext)) {
        out.push(info);
      } else {
        invalid.push(info);
      }
    }
  }
}

/**
 * recursively collects the page under the root directory, it's up to caller to
 * handler the internal potentially exceptions such as the root directory is not
 * accessible
 *
 * @param root
 */
export async function collectPages(
  root: string,
  maxDepth = 10,
  raiseError = true
) {
  const infos: PageInfo[] = [];
  const invalid: PageInfo[] = [];

  await _collectPages(root, root, infos, invalid, 1, maxDepth, raiseError);
  return {
    infos,
    invalid,
    get ok() {
      return this.invalid.length === 0;
    },
  };
}
