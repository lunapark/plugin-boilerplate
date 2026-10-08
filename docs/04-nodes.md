# 04 – Logic nodes

Examples: [`src/features/nodes/`](../src/features/nodes), [`src/features/backend/nodes.ts`](../src/features/backend/nodes.ts), [`src/features/files/index.ts`](../src/features/files/index.ts), [`src/features/interfaces/index.ts`](../src/features/interfaces/index.ts)

```ts
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const addNode = makeLogicNode({
    name: "math/add",                       // registered as "<pluginId>/math/add"
    inputs: {
        in_exec: LogicType.exec(),
        in_a: LogicType.number({ name: "A" }),
        in_b: LogicType.number({ name: "B" })
    },
    outputs: {
        out_exec: LogicType.exec(),
        out_result: LogicType.number({ name: "A + B" })
    },
    methods: {
        in_exec() {
            this.out_result = this.in_a + this.in_b;
            return this.out_exec();
        }
    },
    display: { name: "Add" },
    documentation: { short: "Add two numbers", description: "…" }
});
```
Register it in `editor.nodes`, either as an array or as a function of `env` that returns one.

## Conventions
- Pin keys start with `in_` / `out_`. The compiler and the `this` proxy rely on this.
- `name` is the stable id. Projects save nodes as `<pluginId>/<name>`, so renaming breaks them.
- Each pin's `name` is its label. Pins are shown in declaration order. Files that care about the order disable the `sort-keys-custom-order` lint rule.

## Node kinds (picked automatically from `methods`)

| Kind | Methods | Compiled |
|------|---------|:-:|
| **Function** | exactly one method, keyed by an exec input (`in_exec`) | ✅ |
| **Operation** | methods keyed by data outputs (`out_x() { return … }`), computed lazily | ✅ |
| **Macro** | several methods keyed by exec inputs | ⚠ runs in the editor, but **plugin macros can't be compiled yet**, so avoid them |

## Exec methods: return the exec output
When calling an exec output is the last thing a method does, **return it from a non-async method**:
```ts
in_exec() {
    this.out_result = compute(this.in_value);
    return this.out_exec();
}
```
Non-async methods run faster. Only use `async` when something else must be awaited first, and still `return this.out_exec()` at the end:
```ts
async in_exec() {
    await navigator.clipboard.writeText(this.in_text);
    return this.out_exec();
}
```
Branching works the same way: `return cond ? this.out_true() : this.out_false();`.

## `this` inside methods

| Member | Meaning |
|--------|---------|
| `this.in_x` | Value of a data input (arrays for `multiple` inputs) |
| `this.out_x = v` | Set a data output (function nodes) |
| `this.out_exec()` | Run what is wired to an exec output. Returns a promise, which you return |
| `this.config` | Values of the node's `config` (see below) |
| `this.internal_*` | Free scratch state for this node instance and stack |
| `this.cache` | Object that persists for the node instance |
| `this.instance(deps, factory, key?)` | Memoized per-instance value, e.g. a composable (`useX()`) |
| `this.arguments` | Values of the data inputs, in order |
| `this.properties` | `{ [input]: { name, value } }` |
| `this.stack` | Current execution stack (advanced) |

## Async vs sync: `{ async, sync }`
```ts
methods: {
    in_exec: {
        async async() { for (…) { await this.out_loop(); } return this.out_done(); },
        sync() { for (…) { this.out_loop(); } return this.out_done(); }
    }
}
```
The `async` variant runs when the node's built-in "async" setting is on, the incoming wire is a promise, or the editor animates or debugs the graph. Pins can follow that setting: `LogicType.exec({ dynamic: ({ config }) => LogicType.exec({ promise: !!config.async }) })`. See `async.ts`.

## Node `config`
Settings stored on each node instance and edited in the inspector, not as pins:
```ts
config: { separator: LogicType.string({ default: ", " }) },
methods: { out_text() { return this.in_items.join(this.config.separator); } },
build: { generate: ({ config }) => `function () { return this.in_items.join(${ JSON.stringify(config?.separator) }); }` }
```

## Dynamic types
- **Per pin:** `dynamic: ({ config, inputs, outputs }) => TSchema` recomputes the pin's schema. Use it for:
  - enums built from `internals` (`dynamic.ts`, the Users plugin's roles and providers);
  - generic outputs that follow an input's type (`inputs.in_array.items`).
- **Per node:** `dynamics: { inputs(io), outputs(io) }` returns extra or replacement pins. `io` contains `{ config, inputs, outputs, optionals }`, where each pin is `{ linked, schema, value }`. Document how it works in `documentation.dynamics`.

## `display`

| Key | Effect |
|-----|--------|
| `name` | Title on the node and in search |
| `altSearch` | Extra search keywords |
| `priority` | Search ranking |
| `config.icon`, `config.back` | Header icon and large background icon (Font Awesome `IconDefinition` or string) |
| `config.hue` | Header colour, 0-360 |
| `config.scope` | `ELogicScope.Frontend \| Backend \| Shared \| Desktop` (see [12](12-backend.md)) |
| `config.headerless`, `config.transparent`, `config.data.size` | Compact visuals |
| `config.once`, `config.noDelete`, `config.fixed`, `config.noSelection` | Behaviour flags |
| `custom`, `interface`, `inspector` | Custom Vue renderers (advanced) |

## `documentation`
The node's help panel shows it, and the AI assistant reads it. Fill it in.
```ts
documentation: {
    short: "Convert °C to °F",                       // one imperative line
    description: "Computes `°F = °C × 9/5 + 32`.",  // Markdown
    parameters: [{ name: "in_celsius", description: "…" }],
    examples: [{ inputs: [{ key: "in_celsius", value: 0 }], outputs: [{ key: "out_fahrenheit", value: 32 }] }],
    dynamics: "How dynamic pins work, if any."
}
```

## Code generation (`build`)
When the project is compiled, each node becomes JavaScript:

| | Behaviour |
|---|---|
| No `build` | The **first method's source** is copied as-is. It must be self-contained: only `this.*` and globals, no imports, no module variables |
| `build.generate(data)` | Return the code yourself: a **function expression** string that uses `this.in_*` / `this.out_*` |
| `build.imports` | `[{ name, target }]` adds `import { name } from "target"` |
| `build.define` | `[{ id: () => "x", values: () => "const [[x]] = …;" }]` adds module-level statements once per component (operation nodes). `[[x]]` becomes a unique name |
| `[[file:<id>]]` | Replaced by the project file's variable, with its import added |

`generate` receives:
- **function nodes:** `{ config }`;
- **operation nodes:** `{ config, id, inputKeys, key }`.
  - `key` is the output being generated, so branch on it when there are several outputs;
  - `id` is a unique name for this node instance (use it as the `this.instance` key);
  - `inputKeys` lists the inputs that have a value.

Typical import targets:
- your own package: `<package>/runtime`, `/server`, `/shared`. Declare the package in `build.frontImports` / `backImports`;
- third-party packages;
- generated-app modules: `@/utils/api` (`route()`), `@/utils/lib.ts` (`useInstances`), `@/database/index.js`, `@/context.js`.

Reactive operation node (`codegen.ts`):
```ts
methods: { out_width() { return this.instance([], () => useWindowWidth()).value; } },
build: {
    define: [{ id: () => "instance", values: () => "const [[instance]] = useInstances();" }],
    generate: ({ id }) => `() => { return [[instance]]([], () => useWindowWidth(), ${ JSON.stringify(id) }).value; }`,
    imports: [{ name: "useWindowWidth", target: RUNTIME_TARGET }, { name: "useInstances", target: "@/utils/lib.ts" }]
}
```

## Checklist
1. Pick a stable `name` and use `in_` / `out_` keys.
2. `return this.out_exec()` from non-async methods whenever possible.
3. Set `display.config.scope` when the node uses browser or Node APIs.
4. Write `documentation.short` + `description`.
5. Add `build.generate` + `build.imports` whenever the method uses imported code.
6. Register it in `editor.nodes`.
