/**
 * FEATURE: project files created by the plugin (`env.addFile` / `env.getFile`).
 *
 * A plugin can add real files to the user's project (stores, databases, scripts, ...) and then
 * build on them. The user sees and edits them like any other file.
 *
 * The pattern, from `lifecycle.mount`:
 *   1. keep the created file's id in `internals.files`, which is saved with the project;
 *   2. on every mount, recreate the file if the id is missing or the user deleted the file.
 *      This keeps the operation idempotent;
 *   3. reach the live file through `env.getFile(id)`. A Store's `.value` is reactive, and a
 *      Database's `.db` has `find`, `insert`, ...
 *
 * Schema options for plugin-owned files:
 * - `options.freeze`: the user can't edit or delete that field or column (the plugin relies on it);
 * - `options.readonly`: the value can't be edited by hand;
 * - `options.insert` (database root): where user columns are inserted (-2 = before the last two);
 * - `customizable` (object): the user may add sub-fields.
 * A column can point to another database with `{ ...LogicType.string({ target: dbId }), type: "foreign-key" }`.
 *
 * In generated code, `[[file:<id>]]` is replaced by an import of that file (see the node below).
 *
 * Docs: docs/13-files-and-templates.md
 */
import type { TFileDatabase, TFileStore } from "@luna-park/plugin";
import { EElementType, LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/features/internals/internals.ts";
import { env } from "@/lib/env.ts";

function getStoreFile() {
    return {
        name: "Boilerplate Store",
        schema: LogicType.object({
            count: LogicType.number({ name: "count", options: { freeze: true } }),
            lastGreeting: LogicType.string({ name: "lastGreeting", options: { freeze: true } })
        }, { options: { freeze: true } }),
        type: EElementType.Store
    } satisfies Partial<TFileStore<true>>;
}

function getNotesFile() {
    return {
        name: "Boilerplate Notes",
        data: [
            { id: crypto.randomUUID(), archived: false, title: "Great Scott!" },
            { id: crypto.randomUUID(), archived: true, title: "Hidden by the DatabaseScope hook" }
        ],
        schema: LogicType.object({
            // Property order is column order, so keep it meaningful rather than alphabetical
            id: LogicType.string({ name: "id", options: { freeze: true, readonly: true } }),
            title: LogicType.string({ name: "title", options: { freeze: true } }),
            archived: LogicType.boolean({ name: "archived", options: { freeze: true } })
        }, { options: { freeze: true, insert: -1 } }),
        type: EElementType.Database
    } satisfies Partial<TFileDatabase<true>>;
}

/** Creates the plugin files if they don't exist yet. Call from `lifecycle.mount`. */
export function ensureFiles() {
    if (!env.addFile || !env.getFile) {
        return;
    }

    if (!internals.files.store || !env.getFile(internals.files.store)) {
        internals.files.store = env.addFile(getStoreFile()).id;
    }

    if (!internals.files.notes || !env.getFile(internals.files.notes)) {
        internals.files.notes = env.addFile(getNotesFile()).id;
    }
}

function getStore() {
    return internals.files.store ? env.getFile?.(internals.files.store) as TFileStore | undefined : undefined;
}

/**
 * Node writing into the plugin's store. Nodes are built at registration time, so the store id
 * is read from `internals` when the node runs or generates code, never captured earlier.
 */
export const saveGreetingNode = makeLogicNode({
    name: "files/save-greeting",
    inputs: {
        in_exec: LogicType.exec(),
        in_text: LogicType.string({ name: "text" })
    },
    outputs: {
        out_exec: LogicType.exec()
    },
    methods: {
        in_exec() {
            const store = getStore();

            if (store) {
                store.value.lastGreeting = this.in_text;
                store.value.count = (store.value.count as number ?? 0) + 1;
            }

            return this.out_exec();
        }
    },
    display: {
        name: "Save greeting (store file)"
    },
    documentation: {
        short: "Write a greeting into the Boilerplate Store",
        description: "Example of a node using a project file created by the plugin. In generated code, `[[file:<id>]]` becomes an import of the store."
    },
    build: {
        generate: () => `function () {
            [[file:${ internals.files.store }]].value.lastGreeting = this.in_text;
            [[file:${ internals.files.store }]].value.count = ([[file:${ internals.files.store }]].value.count ?? 0) + 1;
            return this.out_exec();
        }`
    }
});
