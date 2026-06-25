#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const desktopPackagePath = join(root, "apps", "desktop", "package.json");
const builderConfigPath = join(root, "apps", "desktop", "electron-builder.yml");
const viteConfigPath = join(root, "apps", "desktop", "electron.vite.config.ts");
const mainEntryPath = join(root, "apps", "desktop", "src", "main", "index.ts");
const preloadEntryPath = join(root, "apps", "desktop", "src", "preload", "index.ts");
const rendererEntryPath = join(root, "apps", "desktop", "src", "renderer", "App.tsx");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const desktopPackageSource = read(desktopPackagePath);
const builderSource = read(builderConfigPath);
const viteSource = read(viteConfigPath);
const mainSource = read(mainEntryPath);
const preloadSource = read(preloadEntryPath);
const rendererSource = read(rendererEntryPath);

const checks = {
  desktopPackageFileExists: existsSync(desktopPackagePath),
  builderConfigExists: existsSync(builderConfigPath),
  viteConfigExists: existsSync(viteConfigPath),
  mainEntryExists: existsSync(mainEntryPath),
  preloadEntryExists: existsSync(preloadEntryPath),
  rendererEntryExists: existsSync(rendererEntryPath),
  desktopMainPointsToBuiltMain: desktopPackageSource.includes('"main": "out/main/index.js"'),
  desktopHasPackageScript: desktopPackageSource.includes('"package"') && desktopPackageSource.includes("electron-builder --config electron-builder.yml"),
  desktopHasWindowsPackageScript: desktopPackageSource.includes('"package:win"') && desktopPackageSource.includes("electron-builder --win --x64"),
  desktopHasDirectoryPackageScript: desktopPackageSource.includes('"package:dir"') && desktopPackageSource.includes("electron-builder --dir"),
  desktopDependsOnElectronBuilder: desktopPackageSource.includes('"electron-builder"'),
  builderSetsAppId: builderSource.includes("appId: com.remotedesk.desktop"),
  builderSetsProductName: builderSource.includes("productName: RemoteDesk"),
  builderEnablesAsar: builderSource.includes("asar: true"),
  builderIncludesOutDirectory: builderSource.includes("out/**"),
  builderSetsMainMetadata: builderSource.includes("main: out/main/index.js"),
  builderDefinesReleaseOutput: builderSource.includes("output: release"),
  builderDefinesWindowsTarget: builderSource.includes("target: nsis") && builderSource.includes("x64"),
  builderDefinesMacTarget: builderSource.includes("target:") && builderSource.includes("dmg"),
  builderDefinesLinuxTarget: builderSource.includes("AppImage"),
  viteConfigDefinesMain: viteSource.includes("main") && viteSource.includes("src/main/index.ts"),
  viteConfigDefinesPreload: viteSource.includes("preload") && viteSource.includes("src/preload/index.ts"),
  viteConfigDefinesRenderer: viteSource.includes("renderer"),
  mainCreatesBrowserWindow: mainSource.includes("BrowserWindow"),
  preloadExposesBridge: preloadSource.includes("contextBridge") || preloadSource.includes("preload"),
  rendererAppExists: rendererSource.includes("function App") || rendererSource.includes("export default"),
};

const failures = Object.entries(checks)
  .filter(([, ok]) => !ok)
  .map(([name]) => name);

const status = failures.length > 0 ? "FAIL" : "PASS";
const report = {
  repo: "abdulbasit742/anydesk",
  generatedAt: new Date().toISOString(),
  status,
  checks,
  failures,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/desktop-packaging-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/desktop-packaging-check.md",
  [
    "# Desktop Packaging Check",
    "",
    `Status: **${status}**`,
    `Failures: **${failures.length}**`,
    "",
    "| Check | Passed |",
    "|---|---:|",
    ...Object.entries(checks).map(([name, ok]) => `| ${name} | ${ok ? "yes" : "no"} |`),
    "",
    failures.length ? "## Failures" : "",
    ...failures.map((name) => `- ${name}`),
  ].filter(Boolean).join("\n")
);

console.log(`[desktop-packaging:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
