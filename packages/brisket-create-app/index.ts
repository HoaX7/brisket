#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "./package.json";
import { getPkgManager, PackageManager, validateNpmName } from "./helpers";
import type { InitialReturnValue } from "prompts";
import prompts from "prompts";
import { resolve, basename } from "path";
import { cyan, green, red, bold } from "picocolors";
import { existsSync } from "fs";
import { isFolderEmpty } from "./helpers/fs";
import createApp from "./create-app";
import { yellow } from "picocolors";
import updateCheck from "update-check";

const handleSigTerm = () => process.exit(0);

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);

let projectPath = "";

const onPromptState = (state: {
  value: InitialReturnValue;
  aborted: boolean;
  exited: boolean;
}) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write("\x1B[?25h");
    process.stdout.write("\n");
    process.exit(1);
  }
};

const program = new Command(packageJson.name)
  .version(
    packageJson.version,
    "-v, --version",
    "Output the current version of brisket-create-app."
  )
  .argument("[project-name]")
  .usage("[project-name] [options]")
  .helpOption("-h, --help", "Display this help message.")
  //   .option(
  //     "-e, --example <example-name>",
  //     "A starter kit example. You can use an example name from the official Brisket repo."
  //   )
  .option("--use-npm", "Explicitly tell the CLI to use npm.")
  .option("--use-pnpm", "Explicitly tell the CLI to use pnpm.")
  .option("--use-yarn", "Explicitly tell the CLI to use Yarn.")
  .option("--use-bun", "Explicitly tell the CLI to use Bun.")
  .option(
    "--skip-install",
    "Explicitly tell the CLI to skip installing packages."
  )
  .option("--disable-git", `Skip initializing a git repository.`)
  .action((name) => {
    // Commander does not implicitly support negated options. When they are used
    // by the user they will be interpreted as the positional argument (name) in
    // the action handler. See https://github.com/tj/commander.js/pull/1355
    if (name && !name.startsWith("--no-")) {
      projectPath = name;
    }
  })
  .allowUnknownOption()
  .parse(process.argv);

const opts = program.opts();

const packageManager: PackageManager = !!opts.useNpm
  ? "npm"
  : !!opts.usePnpm
  ? "pnpm"
  : !!opts.useYarn
  ? "yarn"
  : !!opts.useBun
  ? "bun"
  : getPkgManager();

async function run() {
  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: "text",
      name: "path",
      message: "What is your project called?",
      initial: "my-app",
      validate: (name) => {
        const validName = validateNpmName(basename(resolve(name)));
        if (validName.valid) return true;
        return `Invalid project name: ${validName.cause?.[0]}`;
      },
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  if (!opts.skipInstall) {
    const res = await prompts({
      onState: onPromptState,
      name: "skipInstall",
      message: "Do you want to install dependencies?",
      initial: true,
      type: "toggle",
      active: "Yes",
      inactive: "No",
    });

    opts.skipInstall = !res.skipInstall;
  }

  if (!opts.disableGit) {
    const res = await prompts({
      onState: onPromptState,
      name: "disableGit",
      message: "Do you want to initialize a git repository?",
      initial: true,
      type: "toggle",
      active: "Yes",
      inactive: "No",
    });

    opts.disableGit = !res.disableGit;
  }

  if (!projectPath) {
    console.log(
      "\nPlease specify the project directory:\n" +
        `  ${cyan(opts.name())} ${green("<project-directory>")}\n` +
        "For example:\n" +
        `  ${cyan(opts.name())} ${green("my-app")}\n\n` +
        `Run ${cyan(`${opts.name()} --help`)} to see all options.`
    );
    process.exit(0);
  }

  const appPath = resolve(projectPath);
  const appName = basename(appPath);

  const validation = validateNpmName(appName);
  if (!validation.valid) {
    console.error(
      `Could not create a project called ${red(
        `"${appName}"`
      )} because of npm naming restrictions:`
    );

    validation.cause?.forEach((p) => console.error(`=${red(bold("*"))} ${p}`));
    process.exit(1);
  }
  if (opts.example === true) {
    console.error(
      "Please provide an example name or url, otherwise remove the example option."
    );
    process.exit(1);
  }

  if (existsSync(appPath) && !isFolderEmpty(appPath, appName)) {
    process.exit(1);
  }

  //   const example = typeof opts.example === "string" && opts.example.trim();

  try {
    await createApp({
      appPath,
      disableGit: opts.disableGit,
      //   example: example && example !== "default" ? example : undefined,
      packageManager,
      skipInstall: opts.skipInstall,
    });
  } catch (err) {
    //
  }
}

const update = updateCheck(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
  try {
    if ((await update)?.latest) {
      const global = {
        npm: "npm i -g",
        yarn: "yarn global add",
        pnpm: "pnpm add -g",
        bun: "bun add -g",
      };
      const updateMessage = `${global[packageManager]} brisket-create-app`;
      console.log(
        yellow(bold("A new version of `brisket-create-app` is available!")) +
          "\n" +
          "You can update by running: " +
          cyan(updateMessage) +
          "\n"
      );
    }
    process.exit(0);
  } catch (err) {
    //
  }
}

async function exit(reason: { command?: string }) {
  console.log();
  console.log("Aborting installation.");
  if (reason.command) {
    console.log(`  ${cyan(reason.command)} has failed.`);
  } else {
    console.log(
      red("Unexpected error. Please report it as a bug:") + "\n",
      reason
    );
  }
  console.log();
  await notifyUpdate();
  process.exit(1);
}

run().then(notifyUpdate).catch(exit);
