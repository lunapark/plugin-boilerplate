# Feature: backend

Code for the generated **Node/Fastify** backend: a backend node, a secret in `.env`, and an injected HTTP route that a frontend node calls.

| File | Role |
|------|------|
| `server.ts` | Server runtime: `configureBoilerplateServer`, `getServerStatus`. Exported from `<package>/server` |
| `crypto.ts` | Isomorphic `signText` (Web Crypto), used in the editor and on the server |
| `nodes.ts` | **Sign text** (`ELogicScope.Backend`) and **Server status** (frontend → `route()`) |
| `build.ts` | `packageImport`, `getEnv` (secret → `.env`), `getBackendInjections` (ServerImport / ServerBody) |

## Editor vs production

| | Editor (simulated backend, in the browser) | Generated backend (Node) |
|---|---|---|
| Node code | `methods` | `build.generate` + `build.imports` |
| Secret | `internals.apiKey` | `process.env.BOILERPLATE_API_KEY` (from `build.env`) |
| Injected route | not available, so simulate it in `methods` | `GET <prefix>/_boilerplate/status` |

## Secrets checklist
1. Keep the secret in `internals` and edit it in a settings tab (`type="password"`).
2. Return it from `build.env`: `{ BOILERPLATE_API_KEY: internals.apiKey }`.
3. In generated code, write `process.env.BOILERPLATE_API_KEY` and never the value. When serialising a whole settings object, swap the secret for a placeholder and then replace that with `process.env.X` (see the Mail plugin's `build.ts`).

## Node-only dependencies
If `server.ts` imports a Node library (e.g. `nodemailer`):
1. add it to `dependencies`;
2. add it to `rolldownOptions.external` in `vite.config.ts`;
3. list it in `build.backImports` so the generated backend installs it.

## Remove it
Delete the folder, then remove `backendNodes`, `build.env`, `getBackendInjections`, and `packageImport` from `backImports` in `src/index.ts`, plus the exports in `src/entries/server.ts`.

Docs: [12 – backend](../../../docs/12-backend.md), [11 – build & codegen](../../../docs/11-build-and-codegen.md)
