# AGENTS.md: building Luna Park plugins

Guide for AI agents (and humans in a hurry) working on this repository or a plugin forked from it.
Read this first, then the relevant `docs/NN-*.md` and the matching `src/features/<name>/` example.

## What this repo is
- A Luna Park plugin: an ES module whose default export is `makePlugin({...})` (`src/index.ts`).
- The Luna Park editor loads it in the browser. When a user exports a project, the compiler uses the plugin's `build` information to generate a Vue + Fastify app.
- Every plugin capability is demonstrated in `src/features/<name>/`. Each folder has a `README.md`.

## Commands
```bash
pnpm install
pnpm typecheck   # vue-tsc -b  (must pass)
pnpm lint        # eslint      (must pass; `pnpm lint:fix` auto-sorts object keys)
pnpm build       # vite build → dist/{index,runtime,server,shared}.js
pnpm preview     # luna-preview on http://127.0.0.1:2084 (install that URL in the editor)
```

## Where things go

| You want to… | Do this | Example |
|---|---|---|
| Add a logic node | `makeLogicNode({...})`, add it to `editor.nodes` | `src/features/nodes/*.ts` |
| Add a UI component | Vue SFC + `TComponent` with `build.imports` → export the SFC from `src/entries/runtime.ts` | `src/features/components/` |
| Add plugin settings (simple) | field in `configSchema` | `src/features/config/index.ts` |
| Add plugin settings (complex or secret) | field in `internals` + a `settings` tab | `src/features/internals/` |
| Run code in the generated frontend | export from `src/entries/runtime.ts`, import via `RUNTIME_TARGET` | `src/features/config/runtime.ts` |
| Run code in the generated backend | export from `src/entries/server.ts`, import via `SERVER_TARGET` | `src/features/backend/server.ts` |
| Add a secret | `internals` → `build.env` → `process.env.X` in generated code | `src/features/backend/build.ts` |
| Add an HTTP route to the app | `ServerBody` injection, `server.register(…, { prefix: serverConfig.prefix })` | `src/features/backend/build.ts` |
| Restrict a route | `editor.guards` (`check` + `build.generate`) | `src/features/guards/` |
| Add per-request context | `hooks[BackendMiddleware]` **and** a `preHandler` in `ServerBody` | `src/features/hooks/` |
| Add something to every element | `editor.panel.element` + directive | `src/features/panel/` |
| Theme values | `editor.tokens` + CSS variables in `inject.css` | `src/features/tokens/` |
| Create project files | `env.addFile` in `lifecycle.mount`, ids in `internals.files` | `src/features/files/` |

## Hard rules
1. **Ids are forever.** Never rename these once published: `PLUGIN_ID`, node `name`, component `name`, token `id`, guard `id`, input key, interface `name`. Projects store them.
2. **Pin keys** start with `in_` / `out_`. Exec pins are `LogicType.exec()`.
3. **Return exec outputs from non-async methods.** `in_exec() { …; return this.out_exec(); }`. Only use `async` when something else is awaited first, and still `return this.out_exec()`.
4. **No plugin macros.** A node with several exec-input methods can't be compiled yet. Use function nodes (one exec input) or operation nodes.
5. **Codegen.** A node without `build.generate` has its first method's source copied verbatim, so that method may only use `this.*` and globals. Anything that calls an imported helper needs `build.generate` + `build.imports`.
6. **Components need `build.imports`** (and a matching export in `src/entries/runtime.ts`), otherwise exported apps can't resolve the tag.
7. **The wrapper is not imported** by the compiler. Register it globally with `AppImport` + `AppBody` (`app.component(name, C)`).
8. **Hooks are editor-only.** Mirror each hook in `ServerBody` (`preHandler`, `addDbScope`, `onDbChange`).
9. **Secrets** never go into `config` or into generated source. Use `internals` + `build.env` + `process.env.KEY`.
10. **Bundle boundaries.** `runtime` = browser + Vue. `server` = Node only. `shared` = isomorphic. None of them may import `@luna-park/design`, `@luna-park/plugin`, `src/lib/env.ts` or editor-only Vue files. Keep shared logic in dependency-free modules.
11. **`env` in build mode** has no `addFile`, `getFile`, `log` or `backend`. Option functions must work with `mode: "build"`.
12. **Prefix everything global**: CSS variables (`--bp-`), env keys (`BOILERPLATE_`), routes (`/_boilerplate/`), interface names.
13. **Components' CSS** must not rely on editor variables (`--color-*`, `--length-*`). Settings tabs, panels and inputs (editor-only) should use them.
14. **Document for the AI assistant.** Fill in `documentation.short` / `description` on nodes, `documentation` / `llm` on components, and `src/llm.md` for the plugin.

## API cheat-sheet
```ts
import {
    makePlugin, makeLogicNode, LogicType, LogicUtil, type Static,
    EInjectionKey, EPluginHooks, ETokenType, ELogicScope, EElementType,
    type TComponent, type TToken, type TElementPanel, type TElementPanelProps, type TRouteGuard,
    type TInterface, type TInterfaceEditorProps, type TTemplate, type THookParams, type TEnv,
    type TFileStore, type TFileDatabase, type TSchema
} from "@luna-park/plugin";
```

`makePlugin` keys:
- **Identity:** `id`, `name`, `icon`, `description`, `color`, `llm`.
- **Settings:** `config`, `internals`, `settings`.
- **Editor hooks:** `lifecycle.{mount,update,unmount}`, `hooks`, `windows`.
- **Contributions:** `editor.{components,nodes,tokens,panel.element,inputs,interfaces,guards,templates,wrapper}`.
- **Injection:** `inject.{css,js}`.
- **Build:** `build.{frontImports,backImports,env,injections}`.

Every `editor.*`, `build.*` and `inject.*` value may be `(env) => value | Promise<value>`.

Injection points:
- **Frontend:** `ViteImport`, `VitePlugin` (end with a comma), `AppImport`, `AppBody` (`app` in scope), `AppSetup` (App.vue `<script setup>`, `[[file:id]]` allowed), `Style`.
- **Backend:** `ServerImport`, `ServerBody` (`server`, `serverConfig` in scope).

Generated-app modules:
- **Frontend:** `@/utils/api` (`route`), `@/utils/lib.ts` (`useInstances`).
- **Backend:** `@/database/index.js` (`dbFind`, `dbInsert`, `dbUpdate`, `dbDelete`, `addDbScope`, `onDbChange`), `@/context.js` (`getRequestContext`).

## Minimal templates
**Node**
```ts
/* eslint-disable sort-keys-custom-order/object-keys */
export const myNode = makeLogicNode({
    name: "category/my-node",
    inputs: { in_exec: LogicType.exec(), in_value: LogicType.string({ name: "value" }) },
    outputs: { out_exec: LogicType.exec(), out_result: LogicType.string({ name: "result" }) },
    methods: {
        in_exec() {
            this.out_result = this.in_value.toUpperCase();
            return this.out_exec();
        }
    },
    display: { name: "My node" },
    documentation: { short: "Uppercase a string", description: "…" }
});
```

**Component**
```ts
export const myComponent = {
    name: "MyPlugin/Thing",
    component: MyThing,
    build: { name: "MyThing", imports: [{ from: RUNTIME_TARGET, name: "MyThing" }] },
    properties: { label: LogicType.string() },
    slots: { default: LogicType.void() }
} satisfies TComponent;
```

## Before finishing a change
- [ ] `pnpm typecheck` and `pnpm lint` pass.
- [ ] New runtime, server or shared exports are added to `src/entries/*`.
- [ ] Generated code paths (`build.generate`, injections) mirror the editor behaviour.
- [ ] The feature's `README.md` and the relevant `docs/` page are updated.
