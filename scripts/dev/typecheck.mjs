import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const TARGETS = ["scripts", "tests", "vitest.config.js"];
const JS_EXTENSIONS = new Set([".js", ".mjs", ".cjs"]);

function collectJsFiles(targetPath, files = []) {
  const stat = statSync(targetPath);

  if (stat.isDirectory()) {
    for (const entry of readdirSync(targetPath, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      collectJsFiles(join(targetPath, entry.name), files);
    }
    return files;
  }

  for (const ext of JS_EXTENSIONS) {
    if (targetPath.endsWith(ext)) {
      files.push(targetPath);
      break;
    }
  }

  return files;
}

const files = TARGETS.map((target) => resolve(ROOT, target))
  .flatMap((target) => collectJsFiles(target))
  .sort();

for (const file of files) {
  execFileSync(process.execPath, ["--check", file], {
    cwd: ROOT,
    stdio: "inherit",
  });
}
