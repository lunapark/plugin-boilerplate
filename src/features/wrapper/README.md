# Feature: app wrapper

A component wrapped around the whole app: the canvas in the editor, and `<RouterView/>` in the exported app.

| File | Role |
|------|------|
| `BpWrapper.vue` | The wrapper. It renders `<slot/>` and must be exported from `src/entries/runtime.ts` |
| `index.ts` | `getWrapper(env)` for `editor.wrapper`, `getWrapperInjections()` for the global registration |

## Gotchas
- In the exported app the wrapper is emitted as a tag (`<BpWrapper density="compact">`) **without an import**. Register it globally (AppImport + AppBody), or rely on a Vue plugin that registers it.
- `attributes` are only used at build time and are serialised like this:
  - string → `key="value"`. A key such as `":locale"` with value `"myVar"` becomes a binding to a variable declared in an `AppSetup` injection;
  - object → `:key='<json>'`;
  - `true` → bare `key`;
  - falsy → omitted.
- With several plugins, wrappers are nested in plugin order.

## Remove it
Delete the folder, then remove `wrapper` from `editor`, `getWrapperInjections()` from `build.injections`, and the `BpWrapper` export from `src/entries/runtime.ts`.

Docs: [02 – plugin manifest](../../../docs/02-plugin-manifest.md), [11 – build & codegen](../../../docs/11-build-and-codegen.md)
