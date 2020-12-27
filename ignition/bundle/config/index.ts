import fs from "fs";
import path from "path";
import webpack from "webpack";
import ChainConfig from "webpack-chain";
import { ConfigFactors } from "./factors";
import { collectPages } from "../pages";
import {
  retrieveLoaders,
  retrieveInternalModules,
  useInternalRuntimeFile,
} from "./util";
import { configScript } from "./script";
import { configPureCss, configPureScss, configScss, configCss } from "./style";
import { configAsset } from "./asset";
import { configOptimize } from "./optimize";
import { GadgetManifestPlugin } from "../plugin/manifest";

export type StringDict = { [key: string]: string };

export async function makeEntries(
  pagesDir: string,
  maxDepth = 10,
  raiseError = true
) {
  const pages = await collectPages(pagesDir, maxDepth, raiseError);
  return pages.infos.reduce((p, c) => {
    const key = ["/404", "/500"].includes(c.route)
      ? c.route.slice(1)
      : "pages" + c.route;
    p[key] = path.join(pagesDir, c.path);
    return p;
  }, {} as StringDict);
}

export async function makeOutlets(pages: StringDict) {
  const outlets: Record<string, string> = {};
  const pageOutletMap: Record<string, string> = {};

  await Promise.all(
    Object.keys(pages).map(async (route) => {
      const page = pages[route];
      // currently we just use regexp to math the outlet
      // a more flexible way maybe introduced later
      const code = (await fs.promises.readFile(page)).toString();
      const exportPattern = /^\s*export\s+(?:const|let)\s+outlet\s+=\s+('|")(.*)(?:(?!\\)\1)/m;
      const matched = code.match(exportPattern);
      if (matched?.length !== 3) {
        throw new Error(
          "Unable detect Outlet for page: " +
            page +
            '\nConsider using `export const outlet = "@/outlet/your_outlet"` in that page to associate a HTML structure with it'
        );
      }

      const cwd = process.cwd();
      const absPath = matched[2].replace(/^@\//, cwd + "/");
      const key = "outlet_" + absPath.replace(cwd, "").replace(/\W/g, "_");
      outlets[key] = absPath;
      pageOutletMap[route.replace(/^pages/, "")] = key;
    })
  );

  return { outlets, pageOutletMap };
}

export async function makeConfig(factors: ConfigFactors) {
  const config = new ChainConfig();

  // entries
  const pageEntries = await makeEntries(factors.pagesDir);

  const entries: StringDict = {
    ...pageEntries,
  };

  const outletInfo = await makeOutlets(pageEntries);
  const pageOutletMap = outletInfo.pageOutletMap;
  const outlets = outletInfo.outlets;
  Object.assign(entries, outletInfo.outlets);

  // `app` contains the bootstrap logic of the runtime module, here we
  // setup it as an entry for let webpack to consider it as a deferred
  // module which can be evaluated immediately once all of its dependencies
  // are resolved
  config.entry("app").add(useInternalRuntimeFile("app"));

  Object.keys(entries).forEach((entry) =>
    config.entry(entry).add(entries[entry])
  );

  // base
  config.mode(factors.mode);
  config.devtool(factors.mode === "development" ? "source-map" : false);
  config.target("web");

  // output
  config.output.path(path.resolve(factors.outputPath));
  config.output.globalObject("(typeof(window)!=='undefined'?window:global)");
  config.output.publicPath(factors.publicPath);
  config.output.filename(
    factors.mode === "production" ? "[name].[chunkhash].js" : "[name].js"
  );

  // script
  configScript(config, factors, outlets);

  // styles
  configPureCss(config, factors);
  configPureScss(config, factors);
  configCss(config, factors);
  configScss(config, factors);
  configAsset(config);

  // resolve
  config.resolve.extensions.merge([
    ".ts",
    ".tsx",
    ".mjs",
    ".js",
    ".jsx",
    ".json",
  ]);

  config.resolve.modules.merge([
    path.resolve(factors.project, "node_modules"),
    "node_modules",
  ]);

  config.resolve.alias.merge({
    ...retrieveInternalModules(),
    "@": factors.project,
    react: path.resolve(__dirname, "react.ts"),
    "react-dom": path.resolve(__dirname, "react-dom.ts"),
  });

  config.resolveLoader.alias.merge(retrieveLoaders());

  config.plugin("deps").use(GadgetManifestPlugin, [pageOutletMap] as any);

  // defines
  const defines: { [k: string]: string } = {
    DEBUG: JSON.stringify(factors.mode === "development"),
  };
  config.plugin("define").use(webpack.DefinePlugin, [defines]);

  // optimize
  configOptimize(config, factors);
  config.performance.maxEntrypointSize(350 * (1 << 10));
  config.performance.maxAssetSize(350 * (1 << 10));

  return config;
}

// return `root + "pages"` as the pages' dir if the concatenated path
// is accessible otherwise return the `root`
export async function concatPagesDir(root: string) {
  const dir = path.resolve(root, "pages");
  await fs.promises.access(dir, fs.constants.R_OK);
  return dir;
}
