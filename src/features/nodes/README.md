# Feature: logic nodes

Nodes are the blocks users wire together in Luna Park's visual logic editor. Each example is in its own file and shows one concept.

| File | Node id | Concept |
|------|---------|---------|
| `function.ts` | `boilerplate/examples/function` | Exec flow: `in_exec` → method → `await this.out_exec()` |
| `operation.ts` | `boilerplate/examples/operation` | Pure data. Methods are keyed by output and compute lazily |
| `branch.ts` | `boilerplate/examples/is-even` | Several exec outputs, `internal_*` state, why to avoid macros |
| `async.ts` | `boilerplate/examples/repeat` | `{ async, sync }` methods, `dynamic` promise pins |
| `node-config.ts` | `boilerplate/examples/format-list` | Per-instance `config`, `this.config`, `generate({ config })` |
| `dynamic.ts` | `…/pick-category`, `…/first-item` | Dynamic enum from `internals`, generic output type |
| `multiple.ts` | `boilerplate/examples/concat` | Variadic `multiple: true` input |
| `types.ts` | `boilerplate/examples/make-profile` | Every `LogicType`, `Static<>`, `LogicUtil` |
| `documented.ts` | `…/celsius-to-fahrenheit` | `display` (icon, hue, altSearch) and `documentation` |
| `scopes.ts` | `…/greeting`, `…/copy-to-clipboard` | `ELogicScope.Shared` / `Frontend` |
| `codegen.ts` | `…/slugify`, `…/window-width` | `build.generate`, `build.imports`, `build.define`, `this.instance` |
| `runtime.ts` / `shared.ts` | – | Helpers the nodes reuse, exported from `<package>/runtime` and `<package>/shared` |

Backend nodes live in [`features/backend`](../backend/README.md). The node that writes a project file lives in [`features/files`](../files/README.md).

## Checklist for a new node
1. Pick a stable `name` (`category/thing`). Projects reference it as `boilerplate/<name>`.
2. Name pins `in_*` / `out_*`. Exec pins are `LogicType.exec()`.
3. When the last action of an exec method is calling an exec output, write `return this.out_exec();` in a **non-async** method. Only use `async` when something else must be awaited first.
4. Set a scope with `display.config.scope` if it uses browser or Node-only APIs.
5. Add `documentation.short` and `documentation.description`, which the AI assistant reads.
6. If the method uses imported code, add `build.generate` + `build.imports`.
7. Add it to `exampleNodes` in `index.ts` (or your own array).

Docs: [04 – nodes](../../../docs/04-nodes.md), [03 – type system](../../../docs/03-type-system.md), [11 – build & codegen](../../../docs/11-build-and-codegen.md)
