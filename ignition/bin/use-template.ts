import path from "path";
import shell from "shelljs";
import chalk from "chalk";
import ora from "ora";
import simpleGit from "simple-git";
import inquirer from "inquirer";
import { fileExists } from "../util";
import { ensureGadgetDir, template, templateAbsPath } from "./config";

export async function useTemplate() {
  await ensureGadgetDir();

  // git clone template into .gadget
  const git = simpleGit();
  const tplAbsPath = await templateAbsPath();

  const tplRelativePath = path.relative(process.cwd(), tplAbsPath);
  if (await fileExists(tplAbsPath)) {
    console.log(chalk.cyan("Using template in: " + tplRelativePath));
    return;
  }

  const spinner = ora("Cloning template into: " + tplRelativePath).start();
  await git.clone(await template(), tplAbsPath);
  spinner.stop();

  // run tpl init.ts or init.coffee
  const initFile = path.resolve(tplAbsPath, "init.ts");
  const isInitFileExists = await fileExists(initFile);
  if (isInitFileExists) {
    console.log(chalk.cyan("Running the init script in template"));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("ts-node").register({
      compilerOptions: {
        module: "CommonJS",
        sourceMap: true,
        esModuleInterop: true,
      },
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
  const isYarn = await fileExists(path.resolve(tplAbsPath, "yarn.lock"));

  const cwd = process.cwd();
  shell.cd(tplAbsPath);
  if (isYarn) {
    shell.exec("yarn");
  } else {
    shell.exec("npm i");
  }
  shell.cd(cwd);

  console.log(chalk.green(`Template installed successfully 🎉`));
}
