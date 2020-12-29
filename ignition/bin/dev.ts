import path from "path";
import chokidar from "chokidar";
import svrx from "@svrx/svrx";
import chalk from "chalk";
import prettyMs from "pretty-ms";
import { build } from "./build";
import { templateAbsPath, configFilePath } from "./config";

// should run in project root which contains a `words` directory stores the words
// and a `.printer` stores the template
export async function dev() {
  let server: any;
  let rebuilding = false;
  let startTime = 0;

  // change dir for building
  process.chdir(await templateAbsPath());
  process.env.DEBUG = "1";

  let first = true;
  const rebuild = async () => {
    if (rebuilding) return;

    // delete previously built chunk of webpack
    Object.keys(global).forEach((k) => {
      if (k.startsWith("webpackChunk")) delete (global as any)[k];
    });

    startTime = new Date().getTime();
    console.log(chalk.cyan("\nChanges detected, building..."));
    rebuilding = true;

    await build(first);
    if (first) first = false;

    console.log(
      chalk.green(
        "Built successfully in " + prettyMs(new Date().getTime() - startTime)
      )
    );

    if (!server) {
      server = svrx({
        root: process.env.BUILD_DIST,
        open: false,
      });
      server.start();
    } else {
      server.reload();
    }

    rebuilding = false;
  };

  await rebuild();

  const words = process.env.WORDS!;
  const watcher = chokidar.watch(
    [
      words + "/**/*.ts",
      words + "/**/*.md",
      words + "/**/*.yml",
      configFilePath(process.env.ROOT),
    ],
    {
      ignoreInitial: true,
      ignored: new RegExp(path.join(words, "_.*\\.md")),
    }
  );

  watcher.on("change", () => {
    rebuild();
  });
  watcher.on("add", () => {
    rebuild();
  });
  watcher.on("unlink", () => {
    rebuild();
  });

  return watcher;
}
