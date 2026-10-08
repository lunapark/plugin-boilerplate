# 07 – Element panels and directives

Example: [`src/features/panel/`](../src/features/panel). Real-world example: the Motion plugin.

An element panel adds a section to the inspector of **every** layout element (narrow it down with `filter`). The user switches it on per element, and its values are stored on the element at `schema.plugins[<pluginId>]`. What the panel does is carried out by a **Vue directive**.

```ts
import type { TElementPanel } from "@luna-park/plugin";

export const highlightPanel: TElementPanel = {
    id: "highlight",
    label: "Highlight",
    icon: faHighlighter,
    filter: (schema) => schema.element !== "slot",
    properties: {
        style: LogicType.string({ default: "outline", enum: { outline: "Outline", glow: "Glow" } }),
        pulse: LogicType.boolean({ optional: true, options: { hidden: (values) => values.style !== "glow" } }),
        intensity: LogicType.number({ default: 2, options: { hidden: true } })
    },
    component: markRaw(LHighlightPanel),
    directive: {
        value: vHighlight,                                       // editor canvas
        build: { from: "<package>/runtime", name: "vHighlight" } // exported app
    },
    actions: [{ icon: faBolt, title: "Flash", onClick: ({ getElements, schema }) => … }]
};
```
Register with `editor: { panel: { element: [highlightPanel] } }`.

## Fields

| Field | Effect |
|-------|--------|
| `id`, `label`, `icon` | Section identity |
| `filter(schema)` | Return `false` to hide the panel for an element (`schema.element`, `schema.tag`, …) |
| `properties` | Form fields. `optional` ones are added with the section's **+** button. `options.hidden` is `true` or `(values) => boolean` |
| `component` | Custom UI rendered above the fields. Gets `TElementPanelProps<T>` = `{ modelValue, schema, getElements }`; emit `update:modelValue` with the **whole** object |
| `directive.value` | Directive applied on the editor canvas. Its binding value is the panel values |
| `directive.build` | `{ from, name: "vXxx" }`: the compiler adds `import { vXxx } from "from"` and writes `v-xxx="{…values}"`. Non-optional properties get their defaults |
| `actions` | Header buttons. `onClick({ getElements, schema })` runs in the editor |

## Writing the directive
- Put it in runtime code (`src/features/panel/runtime.ts`), exported from `src/entries/runtime.ts`.
- Handle `mounted`, `updated` and `unmounted`. `updated` runs often, so make it idempotent or compare with the previous value.
- The same object runs in the editor and in the app, which keeps the preview faithful.
- Values may come from dynamic variables (bound to state), so react to changes in `updated`.
