# 📦 CHANGELOG

All notable changes to **vite-plugin-shopify-assets-sweep** will be documented in this file.

---

## [1.0.0] – 2025-04-18

### Added

- Initial release of `vite-plugin-shopify-assets-sweep`
- Deletes stale assets from Shopify `assets/` directory based on Vite manifest
- Supports `static-assets.json` to whitelist protected files
- Includes `dryRun` mode to preview deletions without removing files
- Works during both `buildStart` and `writeBundle` phases
- Fully configurable via plugin options

---
