# 13 – Project files and templates

## Creating project files
Example: [`src/features/files/`](../src/features/files). Real-world example: the Users plugin, which creates its Users and Sessions databases plus a User store.

From `lifecycle.mount`, a plugin can add real files to the user's project:
```ts
const file = env.addFile({ name: "My Store", type: EElementType.Store, schema: … }, parentFolderId?);
internals.files.store = file.id;          // saved with the project
const live = env.getFile(file.id);        // live file: Store → .value (reactive), Database → .db
```
- `addFile` takes the **export shape** of a file (`Partial<TFileStore<true>>`, `Partial<TFileDatabase<true>>`, …). Type it with `satisfies`.
- Provisioning must be idempotent: create the file only when the stored id is missing or `getFile(id)` returns nothing.
- `addFile` and `getFile` only exist in the editor.

### File types (`EElementType`)
`Store`, `Database`, `Script`, `Logic`, `Component`, `Route`, `Cron`, `Config`, `Type`, `Text`, `Media`, `Folder`.

### Schema options for plugin-owned files
- `options.freeze`: the user can't edit or delete the field or column.
- `options.readonly`: the value can't be edited by hand (database cells).
- `options.insert` on the root object: where user-added fields go (`-1` = before the last one).
- `customizable: true` on an object: the user may add sub-fields.
- Foreign key: `{ ...LogicType.string({ name: "user", target: usersDbId }), type: "foreign-key" }`.
- Derive TS types from the schema: `type TRow = Static<ReturnType<typeof getDb>["schema"]>`.

### Using the files
- **Editor:** `(env.getFile(id) as TFileStore).value.x = …` / `await (env.getFile(id) as TFileDatabase).db.find({ … })`. Database methods: `find`, `findById`, `findWithQuery`, `insert`, `update`, `updateById`, `delete`, `deleteById`, …
- **Generated code:** `[[file:<id>]]` becomes the file's variable and its import is added. It works in `build.generate` and in `AppSetup` injections:
  ```ts
  generate: () => `function () { [[file:${ internals.files.store }]].value.count++; return this.out_exec(); }`
  ```
- **Generated backend:** database tables are addressed by file id: `dbFind(tableId, filter)` from `@/database/index.js`.

## Templates (`editor.templates`)
Example: [`src/features/templates/`](../src/features/templates)

```ts
templates: [{ name: "Landing", preview: previewPng, template: landingJson as unknown as TTemplate["template"] }]
```
- `template` is a folder in **export format** (`TFile<true>`). Build it in the editor, export it, and save the JSON.
- It can use your components (`"element": "plugin/<pluginId>"`, `"content": { "target": "<pluginId>><Component/Name>" }`) and tokens (`"token": "plugin/<pluginId>/<id>"`).
- `preview` is an image URL. Imported PNG or SVG files become URLs or data URIs through Vite.
