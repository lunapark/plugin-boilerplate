# 12 – Backend: scopes, server runtime, guards and hooks

Examples: [`src/features/backend/`](../src/features/backend), [`src/features/guards/`](../src/features/guards), [`src/features/hooks/`](../src/features/hooks)

## Two backends
1. **The editor's simulated backend.** Routes, crons and databases run *in the browser* (PGlite for databases, a cookie store, a stack-based logic runtime). Node `methods`, guard `check` and plugin `hooks` run here.
2. **The generated backend.** A Node + Fastify server. Node `build.generate`, guard `build.generate` and `ServerImport` / `ServerBody` injections run here.

A backend feature needs **both** implementations, and they should behave the same. The simplest way is to share the logic: `features/hooks/visitor.ts` is used by the editor and exported from `<package>/server`.

## Scopes (`display.config.scope`)

| Scope | Usable in | Code goes to |
|-------|-----------|--------------|
| `ELogicScope.Frontend` | components, stores, frontend scripts | frontend bundle |
| `ELogicScope.Backend` | routes, crons, backend scripts | backend bundle |
| `ELogicScope.Shared` | both | both (isomorphic code only) |
| `ELogicScope.Desktop` | desktop (Tauri) apps | desktop bundle |
| *(none)* | everywhere | wherever it's used |

## Server runtime entry
`src/entries/server.ts` → `<package>/server` → `dist/server.js`:
- plain Node: no DOM, no Vue, no `@luna-park/plugin`, no CSS;
- configure it once at startup from `ServerBody` (`configureBoilerplateServer({ apiKey: process.env.X })`);
- list your package in `build.backImports`.

Node-only third-party libraries: add them to `dependencies`, mark them `external` in `vite.config.ts`, and list them in `backImports`.

## Backend node pattern
```ts
makeLogicNode({
    name: "backend/sign",
    inputs: { in_exec: LogicType.exec(), in_text: LogicType.string() },
    outputs: { out_exec: LogicType.exec(), out_signature: LogicType.string() },
    display: { config: { scope: ELogicScope.Backend } },
    methods: {                     // editor: simulated, uses internals
        async in_exec() { this.out_signature = await signText(internals.apiKey, this.in_text); return this.out_exec(); }
    },
    build: {                       // production: reads .env, imports the server entry
        generate: () => `async function () { this.out_signature = await signText(process.env.BOILERPLATE_API_KEY, this.in_text); return this.out_exec(); }`,
        imports: [{ name: "signText", target: SERVER_TARGET }]
    }
});
```
When a side effect can't happen in the editor (emails, payments), log it in `methods` instead. The Mail plugin does this.

## Injected HTTP routes
```js
// ServerBody
await server.register(async (scope) => {
    scope.get("/_boilerplate/status", async (request) => getServerStatus());
}, { prefix: serverConfig.prefix });
```
- The frontend calls it with `route({ method: "get", url: "/_boilerplate/status" })` from `@/utils/api`, which prepends the backend URL and prefix.
- Prefix plugin routes (`/_<pluginId>/…`) so they can't collide with user routes.
- The editor's simulated backend does **not** run injected routes. Simulate them in frontend node `methods` (or emulate them as the Users plugin does).

## Route guards (`editor.guards`)
```ts
const guard: TRouteGuard = {
    id: "visitor-allowlist", label: "Visitor allowlist", description: "…",
    config: LogicType.object({ ids: LogicType.string() }),         // optional per-route form
    check: ({ config, context }) => assertAllowed(context.in_visitor, config.ids),               // editor
    build: {
        generate: (config) => `async (request) => assertAllowed(request.context.in_visitor, ${ JSON.stringify(config.ids) })`,
        imports: [{ name: "assertAllowed", target: SERVER_TARGET }]
    }
};
```
- Users attach guards to a route in its settings. They are referenced as `<pluginId>/<id>`.
- Editor: `check` runs after the `BackendMiddleware` hooks, and `context` holds what they set. Throw to reject.
- Production: each guard becomes a Fastify `preHandler`. Throw an error with `statusCode` (e.g. 403) to reject.

## Hooks (`hooks`) — editor only

| `EPluginHooks` | Params | Use | Production mirror |
|----------------|--------|-----|-------------------|
| `BackendMiddleware` | `{ cookies, setContextVar(key, value) }` | Resolve the user or session for every route | `server.addHook("preHandler", (request) => { request.context[key] = … })` |
| `BackendInputNode` | `{ addInput(key, schema) }` | Expose context values as route input pins | (route input node reads `request.context`) |
| `DatabaseScope` | `{ table, addConditions(conditions) }` | Row-level filtering | `addDbScope((table) => conditions \| undefined)` |
| `DatabaseChange` | `{ table, operation, rows }` | React to writes (after commit) | `onDbChange((change) => …)` (`change.table.id`) |

`table` is the **database file id** (keep it in `internals` when your plugin created the database).

Condition shape (`TDatabaseCondition`):
```ts
{ type: "value", operation: "equals", source: ["column"], target: value }
{ type: "column", operation: "equals", source: ["a"], target: ["b"] }
{ type: "and" | "or", conditions: [ … ] }
// operations: equals, notEquals, greaterThan, lessThan, greaterThanOrEquals, lessThanOrEquals, in, isNull, like, ilike, contains
```

**Always add the production mirror.** Otherwise the deployed app behaves differently from the editor.
