# Feature: element panel + directive

Adds a **Highlight** section to the inspector of layout elements. It applies the `v-highlight` directive (outline or glow).

| File | Role |
|------|------|
| `index.ts` | `TElementPanel`: properties, `filter`, `actions`, `directive`, `component` |
| `LHighlightPanel.vue` | Custom UI for the hidden `intensity` property (`TElementPanelProps`) |
| `runtime.ts` | `vHighlight` directive + `flashElements`, exported from `<package>/runtime` |

## Data flow
```
inspector form / custom UI ─► schema.plugins.boilerplate = { style, color, pulse, intensity }
                                   │
          editor canvas ◄──────────┼──────────► exported app
   directive.value(vHighlight)     │      import { vHighlight } from "<package>/runtime"
                                   │      <div v-highlight="{ style: 'glow', … }">
```

## Behaviour in the inspector
- The section has an on/off switch, and the actions and fields only show while it is on.
- `optional: true` properties start hidden. The user adds them with the **+** button of the section, and can delete them again.
- `options.hidden` (boolean or `(values) => boolean`) hides a field from the generated form.
- `component` renders above the generated fields.

## Use it for
Behaviour that applies to *any* element: animations (see the Motion plugin), tooltips, analytics tags, visibility rules…

## Remove it
Delete the folder, then remove `panel` from `editor` in `src/index.ts` and the `vHighlight` export from `src/entries/runtime.ts`.

Docs: [07 – element panels](../../../docs/07-element-panels.md)
