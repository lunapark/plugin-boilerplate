/**
 * FEATURE: plugin hooks (`hooks`).
 *
 * Hooks let a plugin take part in the editor's **simulated backend**:
 * - `BackendMiddleware`: runs before every route. `setContextVar(key, value)` stores a value
 *   that guards and the route can read. `cookies` holds the simulated request cookies;
 * - `BackendInputNode`: called when a route's input node is built. `addInput(key, schema)`
 *   adds an output to it, usually to expose a value the middleware set;
 * - `DatabaseScope`: called before each query on a table (`table` is the database file id).
 *   `addConditions([...])` adds WHERE conditions, e.g. for row-level security;
 * - `DatabaseChange`: called after a committed insert/update/delete, with
 *   `{ operation, rows, table }`.
 *
 * ⚠ Hooks only run in the editor. The generated backend never calls them, so mirror each one
 * with a `ServerBody` injection (`getHooksInjections` below):
 * - BackendMiddleware → `server.addHook("preHandler", ...)` setting `request.context[key]`;
 * - DatabaseScope     → `addDbScope((table) => conditions)` from "@/database/index.js";
 * - DatabaseChange    → `onDbChange((change) => ...)` from "@/database/index.js".
 *
 * Docs: docs/12-backend.md
 */
import type { THookParams, TPlugin } from "@luna-park/plugin";
import { EInjectionKey, EPluginHooks, LogicType } from "@luna-park/plugin";

import { resolveVisitor, VISITOR_CONTEXT_KEY, VISITOR_COOKIE } from "@/features/hooks/visitor.ts";
import type { TInternals } from "@/features/internals/internals.ts";
import { internals } from "@/features/internals/internals.ts";
import { log } from "@/lib/env.ts";
import type { TInjections } from "@/lib/injections.ts";
import { SERVER_TARGET } from "@/meta.ts";

/** Schema of the visitor object, matching `TVisitor` in ./visitor.ts. */
export const visitorSchema = LogicType.object({
    id: LogicType.string({ name: "id" }),
    known: LogicType.boolean({ name: "known" })
}, { name: "visitor" });

/** Condition hiding archived notes. The same shape is used by the editor and the generated backend. */
const notArchivedCondition = { operation: "equals", source: ["archived"], target: false, type: "value" as const };

export const hooks: NonNullable<TPlugin["hooks"]> = {
    [EPluginHooks.BackendMiddleware]: (params: THookParams[EPluginHooks.BackendMiddleware]) => {
        params.setContextVar(VISITOR_CONTEXT_KEY, resolveVisitor(params.cookies[VISITOR_COOKIE]?.value));
    },
    [EPluginHooks.BackendInputNode]: (params: THookParams[EPluginHooks.BackendInputNode]) => {
        params.addInput(VISITOR_CONTEXT_KEY, { ...visitorSchema, optional: true });
    },
    [EPluginHooks.DatabaseScope]: (params: THookParams[EPluginHooks.DatabaseScope]) => {
        if (params.table === internals.files.notes) {
            params.addConditions([notArchivedCondition]);
        }
    },
    [EPluginHooks.DatabaseChange]: (params: THookParams[EPluginHooks.DatabaseChange]) => {
        if (params.table === internals.files.notes) {
            log(`Boilerplate: ${ params.rows.length } note(s) ${ params.operation }ed`);
        }
    }
};

/** Production equivalent of the hooks above, injected into the generated `server.ts`. */
export function getHooksInjections({ internals }: { internals: TInternals; }): TInjections {
    return {
        // language=JavaScript
        [EInjectionKey.ServerImport]: `
import { resolveVisitor } from "${ SERVER_TARGET }";
import { addDbScope, onDbChange } from "@/database/index.js";
`,
        // language=JavaScript
        [EInjectionKey.ServerBody]: `
server.addHook("preHandler", async (request) => {
    request.context.${ VISITOR_CONTEXT_KEY } = resolveVisitor(request.cookies[${ JSON.stringify(VISITOR_COOKIE) }]);
});

const boilerplateNotesTable = ${ JSON.stringify(internals.files.notes ?? null) };

addDbScope((table) => table.id === boilerplateNotesTable ? [${ JSON.stringify(notArchivedCondition) }] : undefined);

onDbChange((change) => {
    if (change.table.id === boilerplateNotesTable) {
        console.info(\`Boilerplate: \${ change.rows.length } note(s) \${ change.operation }ed\`);
    }
});
`
    };
}
