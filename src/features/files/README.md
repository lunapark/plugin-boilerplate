# Feature: project files

On mount, the plugin creates two files in the user's project:

| File | Type | Used by |
|------|------|---------|
| Boilerplate Store | `EElementType.Store` | The **Save greeting** node (`[[file:<id>]]` in generated code) |
| Boilerplate Notes | `EElementType.Database` | The `DatabaseScope` / `DatabaseChange` hooks ([hooks](../hooks/README.md)) |

## Idempotent provisioning
```ts
if (!internals.files.store || !env.getFile(internals.files.store)) {
    internals.files.store = env.addFile(getStoreFile()).id;
}
```
- The id is saved with the project through `internals`.
- If the user deletes the file, the next mount recreates it.
- `addFile(file, parentId?)` takes the export shape of a file (`Partial<TFileStore<true>>`, …) and returns the live file with its `id`.
- `addFile` / `getFile` only exist in the editor. They are undefined while the app is compiled.

## Referencing a file in generated code
`[[file:<id>]]` in any generated code (`build.generate`, `AppSetup` injections) becomes the file's variable, and the compiler adds the import. For a store, `[[file:<id>]].value` is the reactive state.

## Remove it
Delete the folder, then remove `ensureFiles()` from `lifecycle.mount` and `saveGreetingNode` from `src/index.ts`. The hooks then never match a table, which is harmless.

Docs: [13 – files & templates](../../../docs/13-files-and-templates.md)
