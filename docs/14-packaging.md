# 14 – Packaging

## Entries

| Entry | Source | Output | Runs in | Rules |
|-------|--------|--------|---------|-------|
| `.` | `src/index.ts` | `dist/index.js` | the editor | anything: Vue, `@luna-park/design`, `@luna-park/plugin` |
| `./runtime` | `src/entries/runtime.ts` | `dist/runtime.js` | generated frontend | browser + Vue only. No design, no plugin package, no editor `env` |
| `./server` | `src/entries/server.ts` | `dist/server.js` | generated backend | Node only. No DOM, Vue, CSS or plugin package |
| `./shared` | `src/entries/shared.ts` | `dist/shared.js` | both | isomorphic only |

Each entry must appear in:
1. `vite.config.ts` → `build.lib.entry`;
2. `package.json` → `exports`;
3. `src/meta.ts` → `*_TARGET` constants.

Remove the entries you don't need from all three.

> Keep the entry graphs separate. If `src/entries/server.ts` imports a module that imports `@luna-park/plugin` or a `.vue` file, that code ends up in the server bundle. Put shared logic in small dependency-free modules (see `features/hooks/visitor.ts` vs `features/hooks/index.ts`).

## Externals and dependencies

| Kind | `package.json` | `vite` external | `build.*Imports` |
|------|----------------|:-:|:-:|
| Provided by the editor (`vue`, `@luna-park/design`) | `peerDependencies` (+ `devDependencies`) | ✅ | – |
| Bundled into your code (icons, small libs) | `dependencies` | ❌ | – |
| Needed by generated code, installed by the app | `dependencies` | ✅ | `frontImports` / `backImports` |
| Your own package (runtime/server/shared) | – | – | `frontImports` / `backImports` |

`luna-preview` and esm.sh treat `vue`, `vue-router` and `@luna-park/design` as externals.

## CSS
`vite-plugin-css-injected-by-js` puts the bundled CSS into JS so a single module import is enough.
- `index.js`: the editor gets component and settings styles.
- `runtime.js`: exported apps get component styles.
- `server.js` / `shared.js`: never, because they may run without `document`.

Global CSS for the app goes through `inject.css` ([06](06-styling-and-tokens.md)).

## Font Awesome
- `@luna-park/design` declares Font Awesome **Pro** peers. `.pnpmfile.cjs` removes them so the install works without a licence.
- The boilerplate uses `@fortawesome/free-solid-svg-icons`, bundled as plain icon definitions. With a Pro licence you can switch to `@fortawesome/pro-*` like the official plugins.

## Generating component definitions (`@luna-park/plugin/extractor`)
For component libraries, generate `TComponent`s instead of writing them by hand:
```ts
// generate.ts — run with `vite-node generate.ts`
import { extractFile } from "@luna-park/plugin/extractor";
await extractFile("node_modules/some-lib/Button.vue", "src/generated/button.ts");
```
It reads props, slots, emits and models through the TypeScript compiler, and turns JSDoc into descriptions. Review and adjust the output (names, `build`, `documentation`).

## Stories (optional)
The Users and Nuxt UI plugins use [Histoire](https://histoire.dev) to develop settings tabs and inputs in isolation. Wrap settings components in `LSettingsStoryWrapper` from `@luna-park/plugin`.
