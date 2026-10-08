# Feature: route guards

Access checks that users can attach to backend routes.

| Guard id | Config | Check |
|----------|--------|-------|
| `boilerplate/known-visitor` | – | The `in_visitor` context value must be `known` |
| `boilerplate/visitor-allowlist` | `ids` (string) | The visitor id must be in the list |

## Two implementations, one behaviour

| | Editor | Generated backend |
|---|---|---|
| Code | `check({ config, context })` | `build.generate(config)` → `async (request) => …` preHandler |
| Context | values set by the `BackendMiddleware` hook | `request.context`, set by the preHandler injected in [hooks](../hooks/README.md) |
| Reject | throw | throw an error with `statusCode` (403) |

Both call the same functions from `features/hooks/visitor.ts`, so they behave the same.

## Remove it
Delete the folder and remove `guards` from `editor` in `src/index.ts`.

Docs: [12 – backend](../../../docs/12-backend.md)
