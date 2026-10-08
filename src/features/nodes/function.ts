/* eslint-disable sort-keys-custom-order/object-keys */
/**
 * NODE: function node (execution flow).
 *
 * A node is a "function" when it has an exec input (`LogicType.exec()`) and its single method
 * is keyed by that input. Running the input calls the method, which:
 *   1. reads data inputs through `this.in_*`,
 *   2. writes data outputs to `this.out_*`,
 *   3. calls an exec output (`this.out_exec()`) to continue the flow.
 *
 * Performance rule: when calling an exec output is the method's last action, `return` it and
 * keep the method synchronous (no `async` / `await`). The engine runs non-async methods faster.
 * Only make the method `async` when it has to await something else first (see scopes.ts).
 *
 * Naming conventions:
 * - inputs start with `in_`, outputs with `out_`. The compiler relies on this.
 * - `name` is the node id inside the plugin. The editor registers it as `<pluginId>/<name>`
 *   (here `boilerplate/examples/function`). Never rename it after publishing, because projects
 *   reference nodes by this id.
 * - the `name` argument of each pin is its label in the editor.
 *
 * Build: this node has no `build` key, so the compiler copies the method's source into the
 * generated app as-is. That only works for self-contained code (no imported helpers).
 * See ./codegen.ts for nodes that need imports.
 *
 * Docs: docs/04-nodes.md
 */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const functionNode = makeLogicNode({
    name: "examples/function",
    inputs: {
        in_exec: LogicType.exec(),
        in_a: LogicType.number({ name: "A" }),
        in_b: LogicType.number({ name: "B", default: 1 })
    },
    outputs: {
        out_exec: LogicType.exec(),
        out_result: LogicType.number({ name: "A + B" })
    },
    methods: {
        in_exec() {
            this.out_result = this.in_a + this.in_b;
            return this.out_exec();
        }
    },
    display: {
        name: "Add (function)"
    },
    documentation: {
        short: "Add two numbers when triggered",
        description: "Example of a function node: when `exec` runs, it computes A + B, stores the result and continues."
    }
});
