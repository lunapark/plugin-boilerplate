# 02 – Plugin manifest (`makePlugin`)

```ts
import { makePlugin } from "@luna-park/plugin";

export default makePlugin<typeof configSchema, TInternals>({ id, name, icon, ... });
```

`makePlugin` is an identity function used for typing. Its two generics type `env.config` (from the config schema) and `env.internals`.

## All fields

| Field | Type | Required | Where it shows up | Example |
|-------|------|:-:|---|---|
| `id` | `string` | ✅ | Key of the plugin's data in projects. Prefix of node, guard, input and token ids. **Never change it.** | `src/meta.ts` |
| `name` | `string` | ✅ | Header button, plugin list, element picker category | `src/index.ts` |
| `icon` | `string` (URL / data URI) | ✅ | Header button, plugin list | `src/logo.svg` |
| `description` | `string` | | Plugin list | `src/index.ts` |
| `color` | `string` | | Tint of the plugin's elements in the layout tree | `src/index.ts` |
| `llm` | `string` (Markdown) | | Read by the AI assistant (Sidekick) | `src/llm.md` |
| `config` | `TSchema<TObject>` | | Auto-generated settings form, then `env.config` | [config](../src/features/config) |
| `internals` | `object` (reactive) | | Persisted free-form state, then `env.internals` | [internals](../src/features/internals) |
| `settings` | `Array<{ component, icon?, label }>` | | Tabs in the plugin popup | [internals](../src/features/internals), [windows](../src/features/windows) |
| `windows` | `Record<string, Component>` | | `/plugin?plugin=<target>&window=<key>` | [windows](../src/features/windows) |
| `lifecycle` | `{ mount?, update?, unmount? }` | | Editor hooks (see [10](10-lifecycle.md)) | `src/index.ts` |
| `hooks` | `{ [EPluginHooks]: fn }` | | Simulated backend (see [12](12-backend.md)) | [hooks](../src/features/hooks) |
| `editor.components` | `TComponent[]` | | Element picker | [components](../src/features/components) |
| `editor.nodes` | `TLogicNode[]` | | Logic editor | [nodes](../src/features/nodes) |
| `editor.tokens` | `TToken[]` | | Style inputs | [tokens](../src/features/tokens) |
| `editor.panel.element` | `TElementPanel[]` | | Inspector of every layout element | [panel](../src/features/panel) |
| `editor.inputs` | `Record<string, Component>` | | Custom property inputs | [inputs](../src/features/inputs) |
| `editor.interfaces` | `TInterface[]` | | Class types | [interfaces](../src/features/interfaces) |
| `editor.guards` | `TRouteGuard[]` | | Route settings | [guards](../src/features/guards) |
| `editor.templates` | `TTemplate[]` | | Templates window | [templates](../src/features/templates) |
| `editor.wrapper` | `TComponent & { attributes? }` | | Around the canvas or the app | [wrapper](../src/features/wrapper) |
| `inject.css` | `string` | | Editor page, plus appended to the exported `style.css` | [tokens](../src/features/tokens) |
| `inject.js` | `string` | | Editor preview only. Run with `const app = window.__LUNA_PARK__.app` in scope; not part of builds | – |
| `build.frontImports` | `{ name, version? }[]` | | Generated frontend `package.json` | `src/index.ts` |
| `build.backImports` | `{ name, version? }[]` | | Generated backend `package.json` | `src/index.ts` |
| `build.env` | `Record<string, string>` | | Generated `.env` | [backend](../src/features/backend) |
| `build.injections` | `Partial<Record<EInjectionKey, string>>` | | Generated source files (see [11](11-build-and-codegen.md)) | `src/index.ts` |
| `dependencies` | `{ id, name, target }[]` | | Declared in the type, **not used by the editor yet** | – |
| `interface` | `Component` | | Declared in the type, **not used by the editor yet** | – |

## Values or functions: `TOption`
Every key under **`editor`, `build` and `inject`** can be:
```ts
type TOption<TEnv, T> = T | ((env: TEnv) => T | Promise<T>);
```
- In the **editor**, the functions run reactively: they run again when `config` or `internals` change.
- At **build** time, `loadPlugin(plugin, { app, mode: "build" })` resolves each of them once.

So a node list can depend on settings (`nodes: ({ internals }) => [...]`), and a wrapper or CSS can differ between editor and build (`({ mode }) => ...`).

Top-level keys (`config`, `internals`, `lifecycle`, `settings`, …) are plain values.

## `TEnv`

```ts
type TEnv<TConfig, TInternals> = {
    mode: "editor" | "build";
    config: Static<TConfig>;
    internals: TInternals;
    app: TApplication;                        // the project (tree, config, …)
    addFile(file, parentId?): TFile;          // editor only
    getFile(id): TFile | undefined;           // editor only
    log(message, severity?): void;            // editor only, writes to the Console panel
    backend: { cookies: Record<string, { value; options? }> };  // editor only, simulated cookies
};
```

| | `mode: "editor"` | `mode: "build"` |
|---|---|---|
| `config`, `internals`, `app` | ✅ | ✅ |
| `addFile`, `getFile`, `log`, `backend` | ✅ | ❌ undefined |

Code that needs `env` but doesn't receive it (node methods, hooks, Vue components) reads a copy saved in `lifecycle.mount`. See `src/lib/env.ts`.

## Namespacing

| Item | Stored or referenced as |
|------|-------------------------|
| Node | `<pluginId>/<node.name>` |
| Component on the canvas | `<pluginId>><component.name>` (element `plugin/<pluginId>`) |
| Token | `plugin/<pluginId>/<token.id>` |
| Guard | `<pluginId>/<guard.id>` |
| Input | `<pluginId>/<key>` |
| Panel values | `layoutElement.plugins[<pluginId>]` |
| Config / internals | `app.config.plugins[<pluginId>] = { target, config, internals }` |

Interfaces are **not** namespaced: their `name` is global.

## Other exports of `@luna-park/plugin`
- `makeLogicNode`, `LogicType`, `LogicUtil`, `Static`: nodes and schemas.
- `makeComponent(c)`: identity helper for `TComponent`. `satisfies TComponent` works too.
- `loadPlugin(plugin, env)` and `getPluginParam(option, env)`: resolve `TOption` values, as the compiler does.
- `LSettingsStoryWrapper`: Histoire wrapper sized like the settings popup.
- Enums: `EInjectionKey`, `EPluginHooks`, `ETokenType`, `ELogicScope`, `ELogicType`, `EVarType`, `EElementType`.
- Types: `TPlugin`, `TBasePlugin`, `TEnv`, `TComponent`, `TSlot`, `TElementPanel(Props|Action)`, `TPanels`, `TRouteGuard`, `THookParams`, `TDatabaseCondition`, `TInterface`, `TInterfaceEditorProps`, `TTemplate`, `TToken`, `TFile*`, `TApplication`, `TLayoutSchema`, `TSchema`, `TLogicNode`.
- `@luna-park/plugin/extractor`: generate `TComponent`s from `.vue` / `.d.ts` files (see [14](14-packaging.md)).
