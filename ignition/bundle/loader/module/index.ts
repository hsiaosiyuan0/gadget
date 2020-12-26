import webpack from "webpack";
import path from "path";
import { getOptions } from "loader-utils";
import { isValidatePage } from "../../pages";
import { withRegister } from "./wrap";
import { newNameResolver } from "../util";

function isParentIgnored(pathStr: string) {
  return pathStr.split(path.sep).some((p) => p.startsWith("_"));
}

const moduleLoader: webpack.WebpackPluginFunction = function (source) {
  const options = getOptions(this);
  const pagesDir = options.pagesDir as string;
  const outlets = Object.assign({}, options.outlets ?? {});

  const resolveName = newNameResolver(this, {
    source,
  });

  const url = resolveName("[path][name].[ext]");
  const name = resolveName("[name]");
  const ext = resolveName("[ext]");

  // const pageFsLocate = resolveName("[path][name]");

  const isPageModule =
    url.startsWith(pagesDir) &&
    !isParentIgnored(url) &&
    isValidatePage(name, ext);

  if (isPageModule) {
    const route = resolveName("[path][name]").replace(pagesDir, "");
    return withRegister(route, "pageModules", `"${url}"`, source.toString());
  }

  const outlet = Object.entries(outlets).find(([_, a]) => a === url);
  if (outlet) {
    const [id] = outlet;
    return withRegister(id, "pageModules", `"${url}"`, source.toString());
  }

  return source;
};

export default moduleLoader;
