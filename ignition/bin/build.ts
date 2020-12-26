import fs from "fs";
import path from "path";
import webpack from "webpack";
import mkdirp from "mkdirp";
import { Mode } from "../bundle/config/factors";
import { makeConfig, concatPagesDir } from "../bundle/config";
import { defer, trim } from "../../shared";
import { findExistPath } from "../util";
import { launch, renderContext, renderSSG } from "../render";
import { syncCatalog } from "../catalog";

const absPath = (pth?: string) => {
  if (!pth) return pth;
  return path.isAbsolute(pth) ? pth : path.resolve(pth);
};

export interface BuildOptions {
  root: string;
  mode: Mode;
  basename: string;
  publicPath: string;
  outputPath: string;
  port?: number;
  open?: boolean;
}

async function produceConfig({
  root,
  mode,
  publicPath,
  outputPath,
}: BuildOptions) {
  const pagesDir = await concatPagesDir(root);

  const config = await makeConfig({
    mode,
    project: root,
    pagesDir,
    publicPath,
    outputPath,
    browserslist: ["iOS >= 9"],
  });
  return config;
}

async function buildFromConfig(config: webpack.Configuration) {
  const deferred = defer<webpack.Stats | undefined>();

  const packer = webpack(config);
  packer.run((err, stats) => {
    if (err) {
      deferred.done(err);
      return;
    }
    deferred.done(stats);
  });

  return deferred.promise;
}

// call this method only if the building of `*.data.ts` has
// been finished
async function evaluatePageData(
  route: string
): Promise<Array<{ data: any; route: string }> | { data: any }> {
  const parts = trim(route, ["/"]).split("/");
  const filename = path.join(
    process.cwd(),
    "pages",
    ...parts.slice(0, -1),
    parts[parts.length - 1]
  );
  const file = await findExistPath([
    filename + ".data.ts",
    filename + ".data.js",
  ]);
  if (file) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require(file).default;
      if (typeof m === "function") return await m();
    } catch (error) {
      console.error("Failed to load data script: " + filename, error);
      process.exit(1);
    }
  }

  return [];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("ts-node").register({
  compilerOptions: { module: "CommonJS" },
  transpileOnly: true,
  typeCheck: false,
});

const keyOfPageModules = (ctx: any) =>
  Object.keys(ctx.pageModules).filter((k) => k.startsWith("/"));

export async function generatePages({
  basename,
  outputPath,
}: {
  basename: string;
  outputPath: string;
}) {
  await launch(outputPath);

  const ctx = renderContext();
  ctx.router.basename = basename;

  const pageGenList: Array<{
    pattern: string;
    staticData: any;
    asRoute?: string;
  }> = [];

  const collectDataTasks = keyOfPageModules(ctx).map(async (pattern) => {
    // filter out the `push` method
    if (!pattern.startsWith("/")) return;

    const data = await evaluatePageData(pattern);
    if (Array.isArray(data)) {
      // add wildcard for collection route
      ctx.pageModules[`${pattern}/*`] = ctx.pageModules[pattern];
      ctx.router.routes = keyOfPageModules(ctx);

      data.forEach((r) =>
        pageGenList.push({
          pattern,
          staticData: r.data,
          asRoute: path.join(pattern, r.route),
        })
      );
    } else {
      pageGenList.push({
        pattern,
        staticData: data,
      });
    }
  });

  await Promise.all(collectDataTasks);

  // here for preventing data race on render-context
  // we process pages one by one
  for await (const info of pageGenList) {
    const { pattern, staticData, asRoute } = info;
    gen(pattern, staticData, asRoute);
  }

  async function persistData(data: any, pathname: string) {
    await mkdirp(path.parse(pathname).dir);
    await fs.promises.writeFile(pathname, JSON.stringify(data));
  }

  async function gen(pattern: string, staticData: any, asRoute?: string) {
    const html = await renderSSG(
      { pattern, href: { pathname: pattern } },
      staticData
    );
    const parts = trim(asRoute || pattern, ["/"]).split("/");
    const htmlPathname = path.join(
      outputPath,
      ...parts.slice(0, -1),
      parts[parts.length - 1] + ".html"
    );
    const dataPathname = path.join(
      outputPath,
      "_data",
      ...parts.slice(0, -1),
      parts[parts.length - 1] + ".json"
    );
    await persistData({ code: 200, data: staticData || {} }, dataPathname);
    await mkdirp(path.parse(htmlPathname).dir);
    await fs.promises.writeFile(htmlPathname, html);
  }
}

(async () => {
  // process should be run in `.printer` dir
  const root = process.cwd();

  let outputPath = absPath(process.env.BUILD_DIST);
  outputPath = outputPath || path.join(root, "dist");

  const publicPath = process.env.PUBLIC_URL || "/";

  const opts: BuildOptions = {
    root,
    mode: "development",
    basename: "/",
    outputPath,
    publicPath,
  };

  const cfg = await produceConfig(opts);
  try {
    await buildFromConfig(cfg.toConfig());
  } catch (error) {
    process.exit(1);
  }

  const WORDS = path.resolve(root, "..", "words");
  process.env.WORDS = WORDS;
  await syncCatalog(WORDS);
  await generatePages(opts);
})();
