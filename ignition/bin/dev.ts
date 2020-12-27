import path from "path";
import chokidar from "chokidar";
import svrx from "@svrx/svrx";
import del from "del";
import prettyMs from "pretty-ms";
import { build } from "./build";
import chalk from "chalk";

// should run in project root which contains a `words` directory stores the words
// and a `.printer` stores the template
export async function dev() {
  let server: any;
  let rebuilding = false;
  let startTime = 0;

  const root = process.cwd();

  // change dir for building
  process.chdir(".printer");
  process.env.DEBUG = "1";

  const rebuild = async () => {
    if (rebuilding) return;

    // delete previously built chunk of webpack
    Object.keys(global).forEach((k) => {
      if (k.startsWith("webpackChunk")) delete (global as any)[k];
    });

    startTime = new Date().getTime();
    console.log(chalk.cyan("\nChanges detected, building..."));
    rebuilding = true;

    await del([path.join(root, ".printer", "dist")]);
    await build();
    console.log(
      chalk.green(
        "Built successfully in " + prettyMs(new Date().getTime() - startTime)
      )
    );

    if (!server) {
      server = svrx({
        root: path.join(root, ".printer", "dist"),
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
    [words + "/**/*.ts", words + "/**/*.md", words + "/**/*.yml"],
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
