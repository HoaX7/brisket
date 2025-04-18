import { InstallTemplateProps } from "./types";
import { bold } from "picocolors";
import path from "path";
import { copy } from "../helpers/fs";
import install from "../helpers/install";
export * from "./types";
import { readFile, writeFile } from "fs/promises";
import { cyan, yellow } from "picocolors";

const getDefaultPackageJson = (appName: string) => {
  return {
    name: appName,
    version: "0.1.0",
    repository: {
      type: "git",
      url: "",
    },
    homepage: "",
    author: "",
    license: "",
    keywords: [],
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    dependencies: {},
    devDependencies: {
      "@eslint/js": "^9.24.0",
      "@types/cls-hooked": "^4.3.9",
      "@types/cookie-parser": "^1.4.8",
      "@types/node": "^22.14.1",
      "@typescript-eslint/eslint-plugin": "^8.29.1",
      "@typescript-eslint/parser": "^8.29.1",
      eslint: "^9.24.0",
      globals: "^16.0.0",
      "tsc-alias": "^1.8.15",
      tsx: "^4.19.3",
      typescript: "^5.8.3",
      "typescript-eslint": "^8.29.1",
    },
    engines: {
      node: ">=20",
    },
  };
};

/**
 * Install template to given root dir
 */
export async function installTemplate({
  template,
  mode,
  appName,
  root,
  skipInstall,
  packageManager,
  isOnline,
}: InstallTemplateProps) {
  console.log(bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */
  console.log();
  console.log(`Initializing project with template: ${template}-${mode}`);
  console.log();
  const templatePath = path.join(__dirname, template, mode);
  const copySource = ["**"];

  await copy(copySource, root, {
    cwd: templatePath,
    rename(name) {
      switch (name) {
        case "README-template.md": {
          return "README.md";
        }
        case "env.example": {
          return ".env";
        }
        case "gitignore": {
          return ".gitignore";
        }
        case "dockerignore": {
          return ".dockerignore";
        }
        default:
          return name;
      }
    },
  });

  const packageJsonPath = path.join(root, "package.json");
  let packageJson: any = await readFile(packageJsonPath, "utf-8");
  if (packageJson) {
    packageJson = JSON.parse(packageJson);
    packageJson.name = appName;
  } else {
    console.warn(
      yellow(
        "Missing package.json file from template. Dependencies may not be installed correctly."
      )
    );
    console.log();
    packageJson = getDefaultPackageJson(appName);
  }
  await writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf-8"
  );

  if (skipInstall) {
    console.log(
      `Skipping package installation. You must manually run ${cyan(
        "npm install"
      )} inside the directory.`
    );
    return;
  }
  console.log("Installing packages. This might take a couple of minutes.");
  console.log();
  await install(packageManager, isOnline);
}
