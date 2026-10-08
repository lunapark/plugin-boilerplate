# 08 – Custom inputs and interfaces

## Custom inputs (`editor.inputs`)
Example: [`src/features/inputs/`](../src/features/inputs)

Swap the editor's default input for your own component, on any schema:
```ts
// register: id becomes "<pluginId>/swatch"
editor: { inputs: { swatch: markRaw(LSwatchInput) } }

// use (component props, panel props, config, node inputs, even from other plugins)
LogicType.string({ options: { input: "boilerplate/swatch", colors: ["#f60", "#06f"] } })
```
The component gets `v-model` (the value) and a `schema` prop. Read your own options from `schema.options`.

`defineAsyncComponent(() => import("./HeavyInput.vue"))` is accepted and keeps heavy inputs out of the main bundle. The Nuxt UI icon picker works this way.

## Interfaces (`editor.interfaces`)
Example: [`src/features/interfaces/`](../src/features/interfaces)

An interface is a named **class type** that schemas use through `LogicType.interface("Money")`.

```ts
export const moneyInterface: TInterface = {
    name: "Money",                                // global, shared across all plugins
    class: Money,                                 // for instanceof checks
    extends: ["Amount"],                          // optional parents
    description: "An amount of money…",
    methods: [{ name: "format", parameters: [LogicType.string()], return: LogicType.string() }],
    arguments: [/* constructor parameter schemas */],
    constant: {
        editor: markRaw(LMoneyInput),             // TInterfaceEditorProps: { modelValue, schema, anchor?, placeholder? }
        parse: (value) => Money.parse(String(value)),      // JSON → instance (editor)
        serialize: (instance) => String(instance),         // instance → JSON
        build: {
            generate: (code) => `Money.parse(${ code })`,  // JSON code → expression (exported app)
            imports: [{ name: "Money", target: "<package>/shared" }]
        }
    }
};
```

### How a constant flows
```
LMoneyInput ─► "12.50 EUR" (stored) ─► editor: constant.parse() ─► Money instance
                                     └► build:  Money.parse("12.50 EUR") + import from <package>/shared
```

### Rules
- The class must be importable by generated code. Put it in the shared (or runtime) entry.
- Names are global, so make them specific (`"Money"` could collide; `"AcmeMoney"` won't).
- `extends` makes your type accepted where a parent is expected. The Nuxt UI plugin's `CalendarDate` extends `DateValue`, for example.
- Give typed helpers to node authors: `const moneyType = (args) => LogicType.interface<Money>("Money", args)`.
