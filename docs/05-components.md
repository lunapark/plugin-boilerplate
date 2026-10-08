# 05 – Components

Examples: [`src/features/components/`](../src/features/components)

A component is a regular **Vue SFC** plus a **`TComponent`** description:

```ts
import { LogicType, type TComponent } from "@luna-park/plugin";

export const card = {
    name: "Boilerplate/Card",                                     // picker folder "Boilerplate"
    component: BpCard,                                            // rendered in the editor
    build: {                                                      // used by exported apps
        name: "BpCard",                                           // tag in the template
        imports: [{ from: "<package>/runtime", name: "BpCard" }]  // add default: true for default exports
    },
    properties: { title: LogicType.string(), variant: LogicType.string({ enum: ["outline", "solid"] }) },
    slots: { default: LogicType.void(), footer: LogicType.void() },
    models: { modelValue: LogicType.number() },
    emits: { change: LogicType.number({ name: "value" }) },
    documentation: { description: "…", link: "https://…" },
    icon: faSquare,
    llm: cardDoc                                                  // Markdown for the AI assistant
} satisfies TComponent;
```

## Fields

| Field | Effect |
|-------|--------|
| `name` | `"Folder/Sub/Name"`: the picker folders come from the path. Projects save it as `<pluginId>><name>`, so **keep it stable** |
| `component` | Vue component rendered on the editor canvas |
| `properties` | One schema per prop. The inspector builds inputs from them, honouring `enum`, `format`, `options.token`, `options.input`, … |
| `slots` | `LogicType.void()` = plain slot. `LogicType.object({...})` = scoped slot, whose properties become variables inside the slot. Or a **function** (below) |
| `models` | `v-model` bindings (`modelValue`, or named like `open`) |
| `emits` | Events. The schema is the payload type (`LogicType.void()` for none) |
| `build.name` | Tag used in generated templates (default: last segment of `name`) |
| `build.imports` | Imports added to the generated component file |
| `documentation` | `description` and `link`, shown in the element panel |
| `icon` | Picker icon |
| `llm` | Markdown read by the AI assistant (see `list.md`) |
| `internals` | Per-instance hidden data, deep-cloned when the component is placed and passed as attributes |
| `preview` | Declared in the type, **not used by the editor yet** |

## Dynamic slots
```ts
slots: ({ showEmpty, columns, internals }) => ({
    item: LogicType.object({ item: LogicType.string(), index: LogicType.number() }),
    ...(showEmpty?.value === false ? {} : { empty: LogicType.void() })
})
```
The function receives `{ [prop]: { schema, value } }` plus `internals`, and is called again when props change. A slot schema can also use `dynamic({ inputs })`. The Nuxt UI plugin's `Data/Table` creates one `<column>-cell` slot per column, typed from the `data` prop.

## ⚠ Making components work in exported apps
The compiler writes `<BpCard …>` and adds `build.imports`. **Without `build.imports`, nothing defines the tag** unless a Vue plugin registers it globally through an `AppBody` injection (the Nuxt UI plugin does `app.use(ui)`).

The boilerplate's approach:
1. Export every SFC from `src/entries/runtime.ts` (`export { default as BpCard } from …`).
2. Point `build.imports` at `RUNTIME_TARGET`.
3. Add the package to `build.frontImports` so the app installs it.
4. vite.config.ts injects the CSS into `runtime.js` as well, so scoped styles ship with the components.

## Styling components
- Use scoped CSS.
- Read your own prefixed variables with fallbacks (`var(--bp-spacing, 8px)`).
- **Don't** use editor variables (`--color-content`, `--length-s`): exported apps don't have them.
- Expose theming through tokens and `inject.css` ([06](06-styling-and-tokens.md)).

## Many components
- `editor.components` can be an async function. Auto-register with `import.meta.glob("./**/*.ts", { eager: true })`.
- `@luna-park/plugin/extractor` can generate the `TComponent` definitions from `.vue` / `.d.ts` files ([14](14-packaging.md)).
