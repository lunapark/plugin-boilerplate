# 11 – Build and code generation

When a user exports or deploys a project, Luna Park generates a full app: a Vite + Vue frontend and a Fastify backend. The compiler calls `loadPlugin(plugin, { app, mode: "build" })` and resolves every `editor.*`, `build.*` and `inject.*` option with `env = { app, config, internals, mode: "build" }` (no `addFile`, `getFile`, `log` or `backend`).

## What a plugin adds to the generated project

| Option | Effect |
|--------|--------|
| `build.frontImports: [{ name, version? }]` | Added to `frontend/package.json` dependencies |
| `build.backImports: [{ name, version? }]` | Added to `backend/package.json` dependencies |
| `build.env: Record<string, string>` | Appended to `/.env` as `KEY='value'` |
| `build.injections` | Code inserted at fixed points (table below) |
| `inject.css` | Appended to `frontend/src/style.css` |
| `editor.components[].build` | Tag + imports for each placed component |
| `editor.nodes[].build` | Code for each node ([04](04-nodes.md#code-generation-build)) |
| `editor.panel.element[].directive.build` | Directive import + `v-xxx` attribute |
| `editor.guards[].build` | Route preHandler |
| `editor.interfaces[].constant.build` | Constant reconstruction |
| `editor.tokens` | Token values written into CSS |
| `editor.wrapper` | `<name attrs>` around `<RouterView/>` |

If generated code imports your package (`<package>/runtime|server|shared`), list the package in `frontImports` and/or `backImports`, with the version matching the published one (`src/features/backend/build.ts` → `packageImport`).

## Injection points (`EInjectionKey`)

| Key | File | Location | In scope |
|-----|------|----------|----------|
| `ViteImport` | `frontend/vite.config.ts` | after the imports | – |
| `VitePlugin` | `frontend/vite.config.ts` | inside `plugins: [ … ]`. **End with a comma** | – |
| `AppImport` | `frontend/src/main.ts` | after the imports | – |
| `AppBody` | `frontend/src/main.ts` | after `app.use(router)`, before `app.mount()` | `app` (Vue app), `router` |
| `AppSetup` | `frontend/src/App.vue` | inside `<script setup>`. `import`s are allowed and `[[file:<id>]]` resolves | – |
| `Style` | `frontend/src/style.css` | before plugin CSS and tokens | – |
| `ServerImport` | `backend/src/server.ts` | after the imports | – |
| `ServerBody` | `backend/src/server.ts` | inside `start()`, after CORS, cookies and the request context, **before routes are autoloaded** | `server` (Fastify), `serverConfig` (`{ host, port, prefix, secret, proxy, static }`) |

Generated-app modules you can import from injections and generated code:

| Module | Side | Exports |
|--------|------|---------|
| `@/utils/api` | frontend | `route({ method, url }, { body?, querystring?, params?, headers? })`, `api()` |
| `@/utils/lib.ts` | frontend | `useInstances()`, `getIndexValues()` |
| `@/database/index.js` | backend | `dbFind`, `dbInsert`, `dbUpdate`, `dbDelete`, `dbQuerySelect`, `dbTransaction`, `addDbScope`, `onDbChange`, `withoutDbScopes` |
| `@/context.js` | backend | `getRequestContext()` → `{ request, reply }` (AsyncLocalStorage) |

Backend requests carry `request.context` (an object). Values set there in a preHandler show up in the route's input node and reach guards.

## Combining injections from several features
`build.injections` is a single record, so merge per-feature records ([`src/lib/injections.ts`](../src/lib/injections.ts)):
```ts
injections: (env) => mergeInjections(getConfigInjections(env.config), getWrapperInjections(), getBackendInjections(env))
```

## Secrets
```ts
env: ({ internals }) => ({ BOILERPLATE_API_KEY: internals.apiKey }),
// generated code:
`configure({ apiKey: process.env.BOILERPLATE_API_KEY })`
```
Never `JSON.stringify` a secret into generated code. When serialising a whole settings object, put a placeholder where the secret goes, then replace it:
```ts
JSON.stringify({ ...smtp, password: "MAIL_SMTP_PASSWORD" }).replace(`"MAIL_SMTP_PASSWORD"`, "process.env.MAIL_SMTP_PASSWORD");
```

## Mode-dependent options
Any `editor` / `build` / `inject` option can branch on `env.mode`:
```ts
wrapper: ({ mode }) => mode === "build"
    ? { component: UApp, name: "UApp", attributes: { ":locale": "nuxtUiLocale" } }   // variable declared in an AppSetup injection
    : { component: LEditorWrapper, name: "Wrapper" }
```
The wrapper tag is **not imported** by the compiler. Register it globally (`AppImport` + `AppBody`: `app.component("BpWrapper", BpWrapper)`) or through a Vue plugin.

## Patterns from the official plugins
- **Vue plugin + Vite plugin** (Nuxt UI): `ViteImport` + `VitePlugin` (`ui({...}),`), `AppImport` + `AppBody` (`app.use(ui)`), `Style` (`@import "tailwindcss";`).
- **Runtime configured at startup** (Motion): `AppSetup` → `import { configureMotion } from "<pkg>/runtime"; configureMotion({...})`.
- **Backend service** (Mail): `ServerImport` + `ServerBody` → `configureMail({...secret placeholder...})`.
- **HTTP API** (Users): `ServerBody` registers `server.register(async (s) => { s.get(…) }, { prefix: serverConfig.prefix })` plus a global `preHandler`. The frontend calls the routes with `route({ method, url })` from `@/utils/api`.
