#!/usr/bin/env node

import path from "path";
import { program } from "commander";
import simpleGit from "simple-git";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import prettyMs from "pretty-ms";
import shell from "shelljs";
import { fileExists, isDir } from "../util";
import { dev } from "./dev";
import { build } from "./build";

// eslint-disable-next-line @typescript-eslint/no-var-requires
program.version(require("../../package.json").version);

function fatal(msg: string): never {
  console.log(chalk.red(msg));
  process.exit(1);
}

program
  .command("use <git>")
  .description("use a template by specify its git-repo address")
  .action(async (repo) => {
    // if current has dir named `.printer` stop do further
    const isPrinterExists = await fileExists(".printer");
    if (isPrinterExists) {
      fatal(
        "one .printer directory already exists, stop process for protecting your changes"
      );
    }

    // git clone template into .printer
    const spinner = ora("Cloning into .printer").start();
    const git = simpleGit();
    await git.clone(repo, path.resolve(".printer"));
    spinner.stop();

    // run tpl init.ts or init.coffee
    const initFile = path.resolve(".printer", "init.ts");
    const isInitFileExists = await fileExists(initFile);
    if (isInitFileExists) {
      console.log(chalk.cyan("Running the init script in template"));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("ts-node").register({
        compilerOptions: { module: "CommonJS" },
        transpileOnly: true,
        typeCheck: false,
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fn = require(initFile).default;
        if (typeof fn !== "function") {
          console.log(
            chalk.yellow(
              "No default export found in the init script, initialization is skipped."
            )
          );
        } else {
          await fn(inquirer);
        }
      } catch (error) {
        console.log("Failed to run init script: ", error);
        process.exit(1);
      }
    }

    // install the dependencies of template
    console.log(chalk.cyan("Installing the dependencies of template..."));
    const isYarn = await fileExists(path.resolve(".printer", "yarn.lock"));
    shell.cd(".printer");
    if (isYarn) {
      shell.exec("yarn");
    } else {
      shell.exec("npm i");
    }
    shell.cd("..");

    console.log(`\n🎉 Run below command to start typing:

  ${chalk.cyan(`npx gadget.js typing`)}
`);
  });

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
    await ensureWordsDir(dir);
    await dev();
  });

program
  .command("print [dir]")
  .description(
    "print your words into files with the template crafted by yourself"
  )
  .action(async (dir) => {
    await ensureWordsDir(dir);
    process.chdir(".printer");

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
