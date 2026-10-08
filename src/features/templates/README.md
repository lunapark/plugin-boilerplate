# Feature: templates

| File | Role |
|------|------|
| `demo.json` | A folder in export format containing a component that uses **Boilerplate/Card** |
| `preview.svg` | Thumbnail shown in the templates window |
| `index.ts` | `templates` array for `editor.templates` |

## Making a template
1. Build the folder in the Luna Park editor, using your plugin's components and tokens.
2. Export it and save the JSON here.
3. Take a screenshot for `preview` (PNG, SVG…).
4. Add `{ name, preview, template }` to the array.

Keep ids stable: they are copied into the user's project.

## Remove it
Delete the folder and remove `templates` from `editor` in `src/index.ts`.

Docs: [13 – files & templates](../../../docs/13-files-and-templates.md)
