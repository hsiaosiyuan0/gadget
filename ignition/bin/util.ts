import chalk from "chalk";

export function fatal(msg: string): never {
  console.log(chalk.red(msg));
  process.exit(1);
}
