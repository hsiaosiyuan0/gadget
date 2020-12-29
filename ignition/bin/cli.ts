#!/usr/bin/env node

import path from "path";
import { program } from "commander";
import chalk from "chalk";
import prettyMs from "pretty-ms";
import { templateAbsPath } from "./config";
import { useTemplate } from "./use-template";
import { dev } from "./dev";
import { build } from "./build";
import { fatal } from "./util";
import { fileExists, isDir } from "../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
program.version(require("../../package.json").version);

function ensureEnv() {
  if (!process.env.BUILD_DIST) {
    process.env.BUILD_DIST = path.join(process.cwd(), "dist");
  } else {
    process.env.BUILD_DIST = path.resolve(process.env.BUILD_DIST);
  }
  if (!process.env.PUBLIC_URL) {
    process.env.PUBLIC_URL = "/";
  }
  if (!process.env.BASENAME) {
    process.env.BASENAME = "/";
  }
  process.env.ROOT = process.cwd();
}

async function ensureWordsDir(dir: string) {
  if (dir) process.env.WORDS = path.resolve(dir);
  if (!process.env.WORDS) process.env.WORDS = path.resolve("words");

  const words = process.env.WORDS;
  const isWordsExist = await fileExists(words);
  if (!isWordsExist || !(await isDir(words))) {
    fatal("Unable to find your words' directory at: " + words);
  }
}

program
  .command("typing [dir]")
  .description("typing words and see what's their presentation")
  .action(async (dir) => {
    await useTemplate();
    await ensureWordsDir(dir);
    ensureEnv();
    await dev();
  });

program
  .command("print [dir]")
  .description(
    "print your words into files with the template crafted by yourself"
  )
  .action(async (dir) => {
    await useTemplate();
    await ensureWordsDir(dir);
    ensureEnv();
    process.chdir(await templateAbsPath());

    const startTime = new Date().getTime();
    console.log(chalk.cyan("\nBuilding..."));
    Error.stackTraceLimit = Infinity;
    await build();
    console.log(
      chalk.green(
        "Built successfully in " + prettyMs(new Date().getTime() - startTime)
      )
    );
  });

program.parse(process.argv);
