import { join } from "path";
import type { TaskConfig } from "./types";

export const ROOT_DIR = join(__dirname, "..", "..", "..");
export const PACKAGES_DIR = join(ROOT_DIR, "packages");
export const DIST_DIR = "compiled";

export const DEFAULT_EXTERNALS = {
  // ncc bundled wrong package.json, using external to avoid this problem
  "./package.json": "./package.json",
  "../package.json": "./package.json",
  "../../package.json": "./package.json",
};

export const TASKS: TaskConfig[] = [
  {
    packageDir: "core",
    packageName: "@rsbuild/core",
    dependencies: ["html-minifier-terser"],
  },
];
