# Feature: components

Vue components users can drop into their pages from the element picker.

| Files | Name in picker | Shows |
|-------|----------------|-------|
| `BpCard.vue` + `card.ts` | Boilerplate/Card | properties (string, enum, boolean, token), named slots, `build`, `documentation`, `icon` |
| `BpList.vue` + `list.ts` + `list.md` | Boilerplate/List | scoped slot, **dynamic slots function**, `llm` doc |
| `BpCounter.vue` + `counter.ts` | Boilerplate/Counter | `models` (v-model), `emits` (events) |

## Two places a component runs

| | Editor canvas | Exported app |
|---|---|---|
| What is used | `component` (bundled in `index.js`) | `build.imports` → `<package>/runtime` (`runtime.js`) |
| Tag | – | `build.name` (default: last segment of `name`) |

**Always set `build.imports`.** Without it the generated template uses a tag nothing defines, unless a Vue plugin installed through an `AppBody` injection registers it globally (the Nuxt UI approach).

Each component must also be exported from `src/entries/runtime.ts` under the same name as `build.imports[].name`.

## Checklist for a new component
1. Write the Vue SFC: props, slots, `defineModel`, `defineEmits`, scoped CSS.
2. Describe it in a `TComponent`: `name: "Folder/Name"`, `properties`, `slots`, `models`, `emits`.
3. Set `build: { name, imports: [{ from: RUNTIME_TARGET, name }] }` and export the SFC from `src/entries/runtime.ts`.
4. Add `documentation.description` and, for complex components, an `llm` Markdown file.
5. Add it to the array in `index.ts`.

Tip: `@luna-park/plugin/extractor` (`extractFile`) can generate the `TComponent` from a `.vue` / `.d.ts` file. See [14 – packaging](../../../docs/14-packaging.md).

Docs: [05 – components](../../../docs/05-components.md)
