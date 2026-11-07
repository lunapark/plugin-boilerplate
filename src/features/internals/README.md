# Feature: `internals` + `workspace`

Plugin state that is saved with the project, plus custom Vue workspace sections to edit it.

| File | Role |
|------|------|
| `internals.ts` | `reactive<TInternals>({...})` with a default for every field |
| `LSettings.vue` | A workspace section that binds `@luna-park/design` inputs to `internals` |
| `index.ts` | Exports `internals` and the workspace `sections` array |

## How it works
- On load, the editor copies the saved `app.config.plugins[id].internals` into your object with a **shallow** `Object.assign`, then persists every change. A saved top-level key replaces your default for that key as a whole, so fill in missing nested fields in `lifecycle.mount` (the Users plugin does `internals.general.password ??= …`).
- Option functions (`editor.nodes: (env) => …`, `build.env: (env) => …`) receive `env.internals`. Anything else (node methods, hooks, components) can just `import { internals }`.
- Clicking the plugin button in the editor header opens the plugin's workspace. It lists the `config` form, then each of `workspace.sections` (with its `title`, `icon` and optional `description`), then a Plugin section to remove it.

## `config` vs `internals`

| | `config` | `internals` |
|---|---|---|
| UI | auto-generated from a schema | your own Vue components (`workspace.sections`) |
| Shape | flat typed values | any JSON-serialisable data |
| Typical use | colours, toggles, enums | lists, credentials, file ids, roles… |
| Triggers `lifecycle.update` | yes | no (use Vue `watch` if needed) |

A plugin can use both.

## Secrets
Anything in `internals` is saved in the project file. Before a build, move secrets into `.env` with `build.env` and refer to them as `process.env.X` in generated code. See [backend](../backend/README.md).

## Remove it
Delete the folder, then remove `internals` and `sections` from `src/index.ts` and fix the imports that used `internals` (dynamic node, backend, files).

Docs: [09 – config, internals, settings, windows](../../../docs/09-config-internals-settings-windows.md)
