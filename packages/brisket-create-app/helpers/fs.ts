import { lstatSync, readdirSync, promises } from "fs";
import { basename, dirname, join, resolve } from "path";
import { green, blue } from "picocolors";
import { W_OK } from "node:constants";
import { async as glob } from "fast-glob";
import { copyFile, mkdir } from "fs/promises";

export function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "LICENSE",
    "Thumbs.db",
    "docs",
    "mkdocs.yml",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
    "yarnrc.yml",
    ".yarn",
  ];

  const conflicts = readdirSync(root).filter(
    (file) =>
      !validFiles.includes(file) &&
      // Support IntelliJ IDEA-based editors
      !/\.iml$/.test(file)
  );

  if (conflicts.length > 0) {
    console.log(
      `The directory ${green(name)} contains files that could conflict:`
    );
    for (const file of conflicts) {
      try {
        const stats = lstatSync(join(root, file));
        if (stats.isDirectory()) {
          console.log(`${blue(file)}/`);
        } else {
          console.log(`${file}`);
        }
      } catch {
        console.log(`${file}`);
      }
    }
    console.log(
      "Either try using a new directory name, or remove the files listed above."
    );
    return false;
  }

  return true;
}

export async function isWriteable(directory: string): Promise<boolean> {
  try {
    await promises.access(directory, W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

interface CopyOption {
  cwd?: string;
  rename?: (basename: string) => string;
  parents?: boolean;
}

const identity = (x: string) => x;

export const copy = async (
  src: string | string[],
  dest: string,
  { cwd, rename = identity, parents = true }: CopyOption = {}
) => {
  const source = typeof src === "string" ? [src] : src;

  if (source.length === 0 || !dest) {
    throw new TypeError("`src` and `dest` are required");
  }

  const sourceFiles = await glob(source, {
    cwd,
    dot: true,
    absolute: false,
    stats: false,
  });

  const destRelativeToCwd = cwd ? resolve(cwd, dest) : dest;

  return Promise.all(
    sourceFiles.map(async (p) => {
      const dirName = dirname(p);
      const baseName = rename(basename(p));

      const from = cwd ? resolve(cwd, p) : p;
      const to = parents
        ? join(destRelativeToCwd, dirName, baseName)
        : join(destRelativeToCwd, baseName);

      // Ensure the destination directory exists
      await mkdir(dirname(to), { recursive: true });

      return copyFile(from, to);
    })
  );
};
