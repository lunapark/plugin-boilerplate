/**
 * NODE: async vs sync implementations.
 *
 * A method is either a plain function, or an object `{ async, sync }`:
 * - `async()` runs when the flow is awaited: the node's "async" setting is on, the incoming
 *   wire is a promise, or the editor animates or debugs the graph;
 * - `sync()` runs otherwise and must not await anything.
 *
 * Use this form for flow-control nodes (loops, branches) whose output timing matters.
 *
 * `dynamic` on a pin recomputes its schema from the node state. Here the exec pins are marked as
 * promises when the node is in async mode (`config.async` is a built-in node config value).
 *
 * Docs: docs/04-nodes.md
 */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const asyncNode = makeLogicNode({
    name: "examples/repeat",
    inputs: {
        in_exec: LogicType.exec({ dynamic: ({ config }) => LogicType.exec({ promise: !!config.async }) }),
        in_times: LogicType.number({ name: "times", default: 3 })
    },
    outputs: {
        out_loop: LogicType.exec({ name: "loop", dynamic: ({ config }) => LogicType.exec({ promise: !!config.async }) }),
        out_index: LogicType.number({ name: "index" }),
        out_done: LogicType.exec({ name: "done" })
    },
    methods: {
        in_exec: {
            async async() {
                for (let index = 0; index < this.in_times; index++) {
                    this.out_index = index;
                    await this.out_loop();
                }
                await this.out_done();
            },
            sync() {
                for (let index = 0; index < this.in_times; index++) {
                    this.out_index = index;
                    void this.out_loop();
                }
                return this.out_done();
            }
        }
    },
    display: {
        name: "Repeat (async/sync)"
    },
    documentation: {
        short: "Run a flow several times",
        description: "Example of a node with both an async and a sync implementation."
    }
});
