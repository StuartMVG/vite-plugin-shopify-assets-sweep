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
export default function shopifyAssetsSweep(options?: ShopifyAssetsSweepOptions): Plugin;
export {};
