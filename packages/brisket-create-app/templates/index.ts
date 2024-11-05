import { InstallTemplateProps } from "./types";
import { bold } from "picocolors";
import path from "path";
import { copy } from "../helpers/fs";
import install from "../helpers/install";
export * from "./types";
import { readFile } from "fs/promises";
import { cyan } from "picocolors";

const getDefaultPackageJson = (appName: string) => {
    return {
        name: appName,
        version: "0.1.0",
        main: "server.ts",
        author: "",
        scripts: {
          test: 'echo "Error: no test specified" && exit 1',
          lint: "npx eslint src/**/*.ts --fix",
          dev: "ts-node -r dotenv/config server.ts",
          build: "tsc -p tsconfig.json",
          start: "node -r dotenv/config dist/server.js",
        },
        dependencies: {
          "@fastify/cors": "^10.0.1",
          "@fastify/helmet": "^12.0.1",
          "@fastify/rate-limit": "^10.1.1",
          axios: "^1.7.7",
          "cls-hooked": "^4.2.2",
          dotenv: "^16.4.5",
          fastify: "^5.0.0",
          "fastify-cookie": "^5.6.1",
          "fastify-plugin": "^5.0.1",
          winston: "^3.15.0",
        },
        devDependencies: {
          "@eslint/js": "^9.13.0",
          "@types/cls-hooked": "^4.3.9",
          "@types/cookie-parser": "^1.4.7",
          "@types/node": "^22.7.9",
          "@typescript-eslint/eslint-plugin": "^8.11.0",
          "@typescript-eslint/parser": "^8.11.0",
          eslint: "^9.13.0",
          globals: "^15.11.0",
          typescript: "^5.6.3",
          "typescript-eslint": "^8.11.0",
        },
        engines: {
          node: ">=20",
        },
      }
}

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
  console.log("\nInitializing project with template:", template, "\n");
  const templatePath = path.join(__dirname, template, mode);
  const copySource = ["**"];

  await copy(copySource, root, {
    cwd: templatePath,
    rename(name) {
      switch (name) {
        case "README-template.md": {
          return "README.md";
        }
        default:
          return name;
      }
    },
  });

  let packageJson: any = await readFile(
    path.join(root, "package.json"),
    "utf-8"
  );
  if (packageJson) {
    packageJson = JSON.parse(packageJson);
    packageJson.name = appName;
  } else {
    packageJson = getDefaultPackageJson(appName);
  }

  if (skipInstall) {
    console.log(`Skipping package installation. You must manually run ${cyan("npm install")} inside the directory.`);
    return;
  }
  console.log('Installing packages. This might take a couple of minutes.')
  console.log()
  await install(packageManager, isOnline);
}
