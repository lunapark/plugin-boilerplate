# Feature: custom inputs

Swap the editor's default input for one of your own Vue components, on any schema.

| File | Role |
|------|------|
| `LSwatchInput.vue` | A colour swatch picker (`v-model` + `schema` prop) |
| `index.ts` | `inputs` record for `editor.inputs` and the `swatchType()` schema helper |

Used by the `color` property of **Boilerplate/Card** (`features/components/card.ts`).

## Contract
- Registration: `editor.inputs: { swatch: Component }`, which becomes the id `boilerplate/swatch`.
- Usage: `LogicType.string({ options: { input: "boilerplate/swatch" } })`.
- Props: `modelValue` (v-model) and `schema`. Extra `schema.options.*` keys act as your input's own settings (`colors` here).
- The input only runs in the editor, so it may use `@luna-park/design`.

## Remove it
Delete the folder, remove `inputs` from `editor` in `src/index.ts`, and replace `swatchType()` in `card.ts` with `LogicType.string({ format: "color" })`.

Docs: [08 – inputs & interfaces](../../../docs/08-inputs-and-interfaces.md)
