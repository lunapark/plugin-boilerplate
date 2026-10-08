# Luna Park Plugin Boilerplate

The reference starting point for **Luna Park** plugins. It is a working plugin that uses **every feature of the plugin system**, one feature per folder, with comments in the code and guides in [`docs/`](docs). Delete what you don't need and keep the rest.

> 🤖 Building with an AI assistant? Point it at [`AGENTS.md`](AGENTS.md).

## Quick start
```bash
pnpm install
pnpm dev        # rebuild dist/ on change
pnpm preview    # serve dist/ on http://127.0.0.1:2084
```
In the Luna Park editor, open **Plugins → Install from URL** and enter `http://127.0.0.1:2084`.

| Script | |
|--------|---|
| `pnpm build` | production build → `dist/` |
| `pnpm typecheck` | `vue-tsc -b` |
| `pnpm lint` / `pnpm lint:fix` | ESLint |

## Feature map

| Feature | Folder | Plugin API | Guide |
|---------|--------|------------|-------|
| Plugin config form | [`config`](src/features/config) | `config`, `lifecycle.update`, `AppSetup` injection | [09](docs/09-config-internals-settings-windows.md) |
| Persisted state + settings tabs | [`internals`](src/features/internals) | `internals`, `settings` | [09](docs/09-config-internals-settings-windows.md) |
| Logic nodes (12 examples) | [`nodes`](src/features/nodes) | `editor.nodes`, `makeLogicNode`, `LogicType` | [04](docs/04-nodes.md), [03](docs/03-type-system.md) |
| UI components | [`components`](src/features/components) | `editor.components`, `TComponent` (props, slots, models, emits, llm) | [05](docs/05-components.md) |
| Design tokens + global CSS | [`tokens`](src/features/tokens) | `editor.tokens`, `inject.css` | [06](docs/06-styling-and-tokens.md) |
| App wrapper | [`wrapper`](src/features/wrapper) | `editor.wrapper`, `AppImport` / `AppBody` | [11](docs/11-build-and-codegen.md) |
| Element panel + directive | [`panel`](src/features/panel) | `editor.panel.element` | [07](docs/07-element-panels.md) |
| Custom property input | [`inputs`](src/features/inputs) | `editor.inputs`, `options.input` | [08](docs/08-inputs-and-interfaces.md) |
| Custom class type | [`interfaces`](src/features/interfaces) | `editor.interfaces` | [08](docs/08-inputs-and-interfaces.md) |
| Backend runtime, secrets, routes | [`backend`](src/features/backend) | `build.env`, `backImports`, `ServerImport` / `ServerBody`, `ELogicScope.Backend` | [12](docs/12-backend.md), [11](docs/11-build-and-codegen.md) |
| Route guards | [`guards`](src/features/guards) | `editor.guards` | [12](docs/12-backend.md) |
| Simulated-backend hooks | [`hooks`](src/features/hooks) | `hooks` (`EPluginHooks.*`) | [12](docs/12-backend.md) |
| Project files (store, database) | [`files`](src/features/files) | `env.addFile`, `env.getFile`, `[[file:id]]` | [13](docs/13-files-and-templates.md) |
| Templates | [`templates`](src/features/templates) | `editor.templates` | [13](docs/13-files-and-templates.md) |
| Standalone windows | [`windows`](src/features/windows) | `windows` | [09](docs/09-config-internals-settings-windows.md) |

Each folder has a `README.md` covering what it shows, the data flow, and how to remove it.

## Project structure
```
src/
  index.ts            makePlugin({...}): puts every feature together (start here)
  meta.ts             plugin id, package name, import targets, prefixes
  llm.md              plugin description for the AI assistant
  logo.svg            plugin icon
  lib/                env.ts (saved editor env), injections.ts (merge helper)
  entries/            runtime.ts / server.ts / shared.ts → <package>/runtime|server|shared
  features/<name>/    one self-contained feature per folder (+ README.md)
docs/                 01 … 14 guides
vite.config.ts        multi-entry library build
.pnpmfile.cjs         makes @luna-park/design installable without Font Awesome Pro
```

## Guides
1. [Getting started](docs/01-getting-started.md): install, dev loop, publishing, forking
2. [Plugin manifest](docs/02-plugin-manifest.md): every `makePlugin` field, `TOption`, `TEnv`, namespacing
3. [Type system](docs/03-type-system.md): `LogicType`, arguments, `options.*`, `LogicUtil`, `Static`
4. [Nodes](docs/04-nodes.md): kinds, `this`, async, config, dynamic types, display, docs, codegen
5. [Components](docs/05-components.md): `TComponent`, slots, models, emits, exported apps
6. [Styling & tokens](docs/06-styling-and-tokens.md)
7. [Element panels](docs/07-element-panels.md)
8. [Inputs & interfaces](docs/08-inputs-and-interfaces.md)
9. [Config, internals, settings, windows](docs/09-config-internals-settings-windows.md)
10. [Lifecycle](docs/10-lifecycle.md)
11. [Build & code generation](docs/11-build-and-codegen.md): injections, secrets, generated-app modules
12. [Backend](docs/12-backend.md): scopes, server runtime, guards, hooks
13. [Files & templates](docs/13-files-and-templates.md)
14. [Packaging](docs/14-packaging.md): entries, externals, CSS, extractor

## Make it yours
1. Rename the package in `package.json`.
2. Edit `PLUGIN_ID`, `CSS_PREFIX` and `ENV_PREFIX` in `src/meta.ts` (the id must never change once published).
3. Replace `src/logo.svg` and `src/llm.md`.
4. Delete the feature folders you don't need, following each folder's "Remove it" section.
5. `pnpm typecheck && pnpm lint`, then `pnpm build` and `npm publish`. Keep the `luna-park` and `plugin` keywords so the editor's plugin search finds it.

## Real-world plugins
- **Mail**: backend node, SMTP settings tab, secret in `.env`, server injection.
- **Motion**: element panel + directive, config, runtime entry.
- **Nuxt UI**: 100+ components, tokens, templates, interfaces, custom inputs, wrapper, Vite/Vue plugin injections.
- **Users**: hooks, guards, project databases and stores, OAuth window, injected HTTP API.
