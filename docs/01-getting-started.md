# 01 – Getting started

## What a plugin is
A Luna Park plugin is an **npm package (ES module)** whose default export is `makePlugin({...})`. The editor loads it with a dynamic `import()`:
- published packages come from `https://esm.sh/<package>?external=vue,vue-router,@luna-park/design`;
- during development, from your local `luna-preview` server URL.

The editor provides `vue`, `vue-router` and `@luna-park/design` itself. That is why they are peer dependencies and are kept out of the bundle.

A plugin can add:
- **editor** features: nodes, components, tokens, panels, inputs, interfaces, guards, templates, settings, windows;
- **build** features: npm dependencies, `.env` secrets and code injections in the app that Luna Park exports.

## Requirements
- Node.js (current LTS)
- pnpm

## Install
```bash
pnpm install
```
`.pnpmfile.cjs` removes the Font Awesome *Pro* peer dependencies of `@luna-park/design`, so the install works without a Pro licence.

## Scripts

| Script | What it does |
|--------|--------------|
| `pnpm dev` | `vite build --watch`: rebuilds `dist/` on every change |
| `pnpm build` | Production build into `dist/` (`index.js`, `runtime.js`, `server.js`, `shared.js`) |
| `pnpm preview` | `luna-preview`: serves `dist/` on `http://127.0.0.1:2084` with CORS for luna-park.app |
| `pnpm typecheck` | `vue-tsc -b` |
| `pnpm lint` / `pnpm lint:fix` | ESLint with `@luna-park/eslint-config` |

`luna-preview` options: `-p/--port` (default 2084) and `-d/--dist` (default `dist`). It rewrites bare imports to `https://esm.sh/<pkg>`, except `vue`, `vue-router` and `@luna-park/design`.

## Development loop
1. Run `pnpm dev` in one terminal and `pnpm preview` in another.
2. In the Luna Park editor, open **Plugins → Install from URL** and enter `http://127.0.0.1:2084`.
3. After each rebuild, reload the editor (or reinstall the plugin) to pick up changes.

## Publishing
1. Set `name`, `version` and `description` in `package.json`, and keep `"keywords": ["luna-park", "plugin"]`. The editor's plugin search finds packages by these keywords.
2. Run `pnpm build`, then `npm publish --access public`.
3. Users install it by package name. Packages outside the `@luna-park/` scope ask the user to confirm first.
4. Generated apps install the **same version** of the package (see `build.frontImports` / `backImports`), so bump the version whenever runtime code changes.

## Forking this boilerplate
1. Rename the package in `package.json`.
2. Change `PLUGIN_ID`, `CSS_PREFIX` and `ENV_PREFIX` in `src/meta.ts`.
3. Replace `src/logo.svg` and `src/llm.md`.
4. Delete the feature folders you don't need (each `README.md` lists what to remove from `src/index.ts`).
5. Run `pnpm typecheck && pnpm lint`.

Next: [02 – plugin manifest](02-plugin-manifest.md)
