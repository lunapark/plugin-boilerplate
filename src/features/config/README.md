# Feature: `config`

A typed settings form that the editor generates from a `LogicType.object` schema.

| File | Role |
|------|------|
| `index.ts` | The schema (`configSchema`), `applyConfig` for the editor, `getConfigInjections` for the build |
| `runtime.ts` | `configureBoilerplate()`. The editor preview and the generated app both call it; it is exported from `<package>/runtime` |

## Data flow

```
project file ──► env.config ──┬─► lifecycle.mount / update ─► applyConfig()         (editor preview)
                              ├─► editor.* / build.* / inject.* option functions (env) => …
                              └─► build.injections ─► AppSetup: configureBoilerplate({...}) (generated app)
```

## Use it when
- The settings are plain values (strings, numbers, booleans, enums, colours) and an auto-generated form is enough.

## Don't use it when
- You need lists, nested editors or a custom UI. Use [`internals` + `settings`](../internals/README.md).
- The value is a secret. Config is saved in plain text in the project and inlined into generated code. Use `internals` + `build.env` ([backend](../backend/README.md)).

## Remove it
Delete this folder. In `src/index.ts`, remove the `config:` key, `applyConfig` from `lifecycle`, and `getConfigInjections` from `build.injections`. In `src/entries/runtime.ts`, remove the `configureBoilerplate` export.

Docs: [09 – config, internals, settings, windows](../../../docs/09-config-internals-settings-windows.md), [03 – type system](../../../docs/03-type-system.md)
