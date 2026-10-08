# Feature: hooks

Takes part in the editor's simulated backend, and mirrors the same behaviour in the generated server.

| Hook | Example here | Production mirror (`ServerBody`) |
|------|--------------|----------------------------------|
| `BackendMiddleware` | Reads the `bp_visitor` cookie and sets `in_visitor` in the context | `server.addHook("preHandler", …)` sets `request.context.in_visitor` |
| `BackendInputNode` | Adds an `in_visitor` output to every route input node | Nothing to add: the route input node reads `request.context` |
| `DatabaseScope` | Hides `archived = true` rows of the plugin's Notes database | `addDbScope(table => …)` |
| `DatabaseChange` | Logs writes to the Notes database | `onDbChange(change => …)` |

| File | Role |
|------|------|
| `visitor.ts` | Shared visitor logic (schema, `resolveVisitor`, assertions), exported from `<package>/server` |
| `index.ts` | `hooks` record + `getHooksInjections(env)` |

## Rules
- Hooks run **only in the editor**. Without the injection mirror, production behaves differently.
- In the editor the `table` id is the database file id, and in production `table.id` is that same id.
- Context keys set by the middleware are what guards receive as `context` (see [guards](../guards/README.md)).
- Database conditions: `{ operation, source: [column], target, type: "value" | "column" }`. Combine them with `{ type: "and" | "or", conditions: [...] }`. Operations: `equals`, `notEquals`, `greaterThan`, `lessThan`, `greaterThanOrEquals`, `lessThanOrEquals`, `in`, `isNull`, `like`, `ilike`, `contains`.

## Remove it
Delete the folder (and [guards](../guards/README.md), which uses `visitor.ts`), then remove `hooks` and `getHooksInjections` from `src/index.ts` and the visitor exports from `src/entries/server.ts`.

Docs: [12 – backend](../../../docs/12-backend.md)
