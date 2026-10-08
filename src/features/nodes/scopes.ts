/**
 * NODES: execution scopes (`display.config.scope`).
 *
 * The scope says where a node can be used, and so which generated bundle its code goes to:
 * - `ELogicScope.Frontend`: browser only (components, stores, frontend scripts);
 * - `ELogicScope.Backend`: server only (routes, crons, backend scripts). See features/backend;
 * - `ELogicScope.Shared`: both. The code must be isomorphic;
 * - `ELogicScope.Desktop`: desktop (Tauri) apps only;
 * - no scope: usable everywhere, like Shared.
 *
 * The editor hides or flags nodes that are used in the wrong scope.
 *
 * Docs: docs/04-nodes.md, docs/12-backend.md
 */
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/features/internals/internals.ts";
import { formatGreeting } from "@/features/nodes/shared.ts";
import { SHARED_TARGET } from "@/meta.ts";

/** Shared: the same helper runs in the editor, the generated frontend and the generated backend. */
export const sharedNode = makeLogicNode({
    name: "examples/greeting",
    inputs: {
        in_name: LogicType.string({ name: "name" })
    },
    outputs: {
        out_text: LogicType.string({ name: "text" })
    },
    methods: {
        out_text() {
            return formatGreeting(this.in_name, internals.signature);
        }
    },
    display: {
        name: "Greeting (shared)",
        config: {
            scope: ELogicScope.Shared
        }
    },
    documentation: {
        short: "Build a greeting message",
        description: "Example of a Shared node. The signature comes from the plugin settings."
    },
    build: {
        // `imports` adds `import { formatGreeting } from "<package>/shared"` to the generated file.
        generate: () => `function () {
            return formatGreeting(this.in_name, ${ JSON.stringify(internals.signature) });
        }`,
        imports: [{ name: "formatGreeting", target: SHARED_TARGET }]
    }
});

/**
 * Frontend: uses a browser API. The method only uses `this` and globals, so with no `build`
 * the compiler can copy it into the generated code as-is.
 */
export const frontendNode = makeLogicNode({
    name: "examples/copy-to-clipboard",
    inputs: {
        in_exec: LogicType.exec(),
        in_text: LogicType.string({ name: "text" })
    },
    outputs: {
        out_exec: LogicType.exec()
    },
    methods: {
        // `async` is needed here because the clipboard API is awaited first. The exec output is still returned.
        async in_exec() {
            await navigator.clipboard.writeText(this.in_text);
            return this.out_exec();
        }
    },
    display: {
        name: "Copy to clipboard (frontend)",
        config: {
            scope: ELogicScope.Frontend
        }
    },
    documentation: {
        short: "Copy text to the user's clipboard",
        description: "Example of a Frontend node: it uses `navigator.clipboard`, which only exists in browsers."
    }
});
