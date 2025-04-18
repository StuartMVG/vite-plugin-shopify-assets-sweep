import fs from "fs";
import path from "path";
import { Plugin } from "vite";

interface ShopifyAssetsSweepOptions {
  manifestFileName?: string;
  themeRoot?: string;
  staticManifestFileName?: string;
  dryRun?: boolean;
}

/**
 * A Vite plugin to sweep away stale Shopify theme assets after build.
 */
export default function shopifyAssetsSweep(
  options: ShopifyAssetsSweepOptions = {}
): Plugin {
  const defaultOptions = {
    manifestFileName: "assets/manifest.json",
    themeRoot: "assets",
    staticManifestFileName: "static-assets.json",
    dryRun: false,
  };

  const resolvedOptions = { ...defaultOptions, ...options };

  function loadStaticWhitelist(): string[] {
    const staticManifestPath = path.resolve(
      process.cwd(),
      resolvedOptions.staticManifestFileName
    );
    if (fs.existsSync(staticManifestPath)) {
      try {
        const content = fs.readFileSync(staticManifestPath, "utf-8");
        const staticFiles = JSON.parse(content);
        if (!Array.isArray(staticFiles)) {
          console.warn(
            `WARNING: ${resolvedOptions.staticManifestFileName} must be an array. Ignoring.`
          );
          return [];
        }
        return staticFiles.map((f) => f.trim());
      } catch (e) {
        console.warn(
          `WARNING: Failed to parse ${
            resolvedOptions.staticManifestFileName
          }: ${(e as Error).message}`
        );
      }
    }
    return [];
  }

  function getFilesInManifest(manifest: Record<string, any>): string[] {
    const files = new Set<string>();

    Object.values(manifest).forEach((entry) => {
      if (typeof entry === "string") {
        files.add(path.basename(entry));
      } else if (entry && typeof entry === "object") {
        if (entry.file) files.add(path.basename(entry.file));
        if (entry.css)
          entry.css.forEach((cssFile: string) =>
            files.add(path.basename(cssFile))
          );
        if (entry.imports)
          entry.imports.forEach((importFile: string) =>
            files.add(path.basename(importFile))
          );
      }
    });

    return Array.from(files);
  }

  function sweepAssets(phase: "buildStart" | "writeBundle") {
    const assetsDir = path.resolve(process.cwd(), resolvedOptions.themeRoot);
    const manifestPath = path.resolve(
      process.cwd(),
      resolvedOptions.manifestFileName
    );
    const staticFiles = loadStaticWhitelist();

    if (!fs.existsSync(assetsDir) || !fs.existsSync(manifestPath)) return;

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const filesInManifest = getFilesInManifest(manifest);

    const assetFiles = fs.readdirSync(assetsDir);
    assetFiles.forEach((file) => {
      const isInManifest = filesInManifest.includes(file);
      const isStatic = staticFiles.includes(file);

      if (!isInManifest && !isStatic) {
        const filePath = path.join(assetsDir, file);
        if (resolvedOptions.dryRun) {
          console.log(`[Dry Run] ${phase}: Would delete ${file}`);
        } else {
          console.log(`${phase}: Deleting ${file}`);
          fs.unlinkSync(filePath);
        }
      }
    });
  }

  return {
    name: "vite-plugin-shopify-assets-sweep",
    apply: "build",

    buildStart() {
      sweepAssets("buildStart");
    },

    writeBundle() {
      sweepAssets("writeBundle");
    },
  };
}
