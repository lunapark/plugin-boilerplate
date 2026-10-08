# Feature: `internals` + `settings`

Plugin state that is saved with the project, plus custom Vue tabs to edit it.

| File | Role |
|------|------|
| `internals.ts` | `reactive<TInternals>({...})` with a default for every field |
| `LSettings.vue` | A settings tab that binds `@luna-park/design` inputs to `internals` |
| `index.ts` | Exports `internals` and the `settings` array |

## How it works
- On load, the editor copies the saved `app.config.plugins[id].internals` into your object with a **shallow** `Object.assign`, then persists every change. A saved top-level key replaces your default for that key as a whole, so fill in missing nested fields in `lifecycle.mount` (the Users plugin does `internals.general.password ??= …`).
- Option functions (`editor.nodes: (env) => …`, `build.env: (env) => …`) receive `env.internals`. Anything else (node methods, hooks, components) can just `import { internals }`.
- Each `settings` tab shows as a tab in the plugin popup, with a `label` and an optional `icon`.

## `config` vs `internals`

| | `config` | `internals` |
|---|---|---|
| UI | auto-generated from a schema | your own Vue components (`settings`) |
| Shape | flat typed values | any JSON-serialisable data |
| Typical use | colours, toggles, enums | lists, credentials, file ids, roles… |
| Triggers `lifecycle.update` | yes | no (use Vue `watch` if needed) |

A plugin can use both.

## Secrets
Anything in `internals` is saved in the project file. Before a build, move secrets into `.env` with `build.env` and refer to them as `process.env.X` in generated code. See [backend](../backend/README.md).

## Remove it
Delete the folder, then remove `internals` and `settings` from `src/index.ts` and fix the imports that used `internals` (dynamic node, backend, files).

Docs: [09 – config, internals, settings, windows](../../../docs/09-config-internals-settings-windows.md)
