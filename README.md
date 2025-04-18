# 🧹 vite-plugin-shopify-assets-sweep

A Vite plugin that **cleans up stale assets** from your Shopify theme's `assets/` folder based on the current Vite manifest — while **preserving static files** defined in a manifest. Ideal for keeping your Shopify repo clean and deploy-ready without clutter from old build artifacts.

---

## ✨ Features

- ✅ Automatically removes outdated hashed build files
- ✅ Preserves files you define in `static-assets.json`
- ✅ Supports `dryRun` mode for safe previewing
- ✅ Works with Shopify’s `assets/` theme directory
- ✅ Runs during both `buildStart` and `writeBundle` phases

---

## 📦 Installation

```bash
npm install vite-plugin-shopify-assets-sweep --save-dev
```

---

## 🚀 Usage

In your `vite.config.ts`:

```ts
import shopify from "vite-plugin-shopify";
import shopifyAssetsSweep from "vite-plugin-shopify-assets-sweep";

export default {
  plugins: [
    shopify({
      sourceCodeDir: "src",
      entrypointsDir: "src/entrypoints",
      snippetFile: "assets.liquid",
    }),
    shopifyAssetsSweep({
      manifestFileName: "assets/manifest.json",
      staticManifestFileName: "static-assets.json",
      dryRun: false,
    }),
  ],
  build: {
    emptyOutDir: false,
  },
};
```

---

## 🧾 `static-assets.json`

Place this file in the **root of your project**. It should list all the static assets you want to **preserve**, even if they aren’t in the current Vite manifest:

```json
["logo.svg", "mezereon.js", "mezereon.css.liquid", "manifest.json"]
```

> These filenames should match what's in the `assets/` folder exactly.

---

## ⚙️ Options

| Option                   | Type      | Default                  | Description                                                 |
| ------------------------ | --------- | ------------------------ | ----------------------------------------------------------- |
| `manifestFileName`       | `string`  | `"assets/manifest.json"` | Path to the Vite-generated manifest file                    |
| `themeRoot`              | `string`  | `"assets"`               | Directory containing your Shopify theme assets              |
| `staticManifestFileName` | `string`  | `"static-assets.json"`   | Path to JSON file listing static assets to preserve         |
| `dryRun`                 | `boolean` | `false`                  | If `true`, logs deletions but doesn't actually remove files |

---

## 🧪 Dry Run Mode

Want to preview what would be deleted?

```ts
shopifyAssetsSweep({
  dryRun: true,
});
```

This will output logs like:

```
[Dry Run] buildStart: Would delete old-script-abc123.js
[Dry Run] writeBundle: Would delete legacy-style-def456.css
```

No files are removed during dry run.

---

## 🛠 Example Project Structure

```
.
├── assets/
│   ├── main-abc123.js
│   ├── old-main-def456.js  ← will be deleted
│   ├── logo.svg            ← preserved via static-assets.json
│   └── manifest.json       ← current Vite manifest
├── src/
│   └── ...
├── static-assets.json
├── vite.config.ts
```

---

## 📄 License

MIT — feel free to use, modify, and contribute.

---

## 💬 Feedback / Contributions

If you find this helpful or have suggestions, feel free to open an issue or PR. Happy sweeping! 🧹
