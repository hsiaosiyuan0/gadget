import fs from "fs";
import path from "path";
import { inspect } from "util";
import webpack from "webpack";
import mkdirp from "mkdirp";
import chalk from "chalk";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import prettyMs from "pretty-ms";
import { Mode } from "../bundle/config/factors";
import { makeConfig, concatPagesDir } from "../bundle/config";
import { defer, trim } from "../../shared";
import { findExistPath } from "../util";
import { launch, renderContext, renderSSG } from "../render";
import { syncCatalog } from "../catalog";

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

const friendlyErr: FriendlyErrorsWebpackPlugin & {
  [k: string]: any;
} = new FriendlyErrorsWebpackPlugin();

function uniqueBy(arr: any[], fun: (el: any) => any) {
  const seen: { [k: string]: any } = {};
  return arr.filter((el) => {
    const e = fun(el);
    return !(e in seen) && (seen[e] = 1);
  });
}

function extractErrorsFromStats(stats: webpack.Stats, type: string) {
  const findErrorsRecursive = (
    compilation: webpack.Compilation & {
      [k: string]: any;
    }
  ) => {
    const errors = compilation[type];
    if (errors.length === 0 && compilation.children) {
      for (const child of compilation.children) {
        errors.push(...findErrorsRecursive(child));
      }
    }

    return uniqueBy(errors, (error) => {
      return error.message;
    });
  };

  return findErrorsRecursive(stats.compilation);
}

function getCompileTime(stats?: webpack.Stats): number {
  if (!stats) return 0;

  return (stats.endTime ?? 0) - (stats.startTime ?? 0);
}

async function buildFromConfig(config: webpack.Configuration) {
  const deferred = defer<webpack.Stats | undefined>();

  const process = webpack(config);

  process.hooks.run.tap("build", () => {
    console.log(chalk.cyan("Compiling ..."));
  });

  process.run((err, stats) => {
    if (stats?.hasWarnings()) {
      const warnings = extractErrorsFromStats(stats, "warnings");
      friendlyErr.displayErrors(
        uniqueBy(warnings, (error) => error.message),
        "warning"
      );
    }

    if (stats?.hasErrors()) {
      const errors = extractErrorsFromStats(stats, "errors");
      friendlyErr.displayErrors(
        uniqueBy(errors, (error) => error.message),
        "warning"
      );
    }

    if (err) {
      deferred.done(err);
      return;
    }

    console.log(
      chalk.green("Compiled successfully in " + prettyMs(getCompileTime(stats)))
    );
    deferred.done(stats);
  });

  return deferred.promise;
}

// exec `*.data.ts` assoc with the route
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
    let m: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      m = require(file).default;
    } catch (error) {
      console.error("Failed to load data script: " + filename, error);
      process.exit(1);
    }

    try {
      if (typeof m === "function") {
        const data = await m();
        if (Array.isArray(data)) {
          const checkData = () => {
            data.forEach((r) => {
              if (r.route === undefined)
                throw new Error(
                  "The key `route` is required of item in collection data, found deformed item: " +
                    inspect(r) +
                    " at file: " +
                    file
                );
            });
          };
          checkData();
        }
        return data;
      }
    } catch (error) {
      console.error("Failed to exec data script: " + filename, error);
      process.exit(1);
    }
  }

  return [];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("ts-node").register({
  compilerOptions: { module: "CommonJS", sourceMap: true },
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

export const build = async () => {
  // process should be run in `.printer` dir
  const root = process.cwd();

  let outputPath = path.resolve(process.env.BUILD_DIST!);
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

  const WORDS = process.env.WORDS!;

  console.log(chalk.cyan("Syncing catalog..."));
  await syncCatalog(WORDS);

  console.log(chalk.cyan("Generating pages..."));
  await generatePages(opts);
};
