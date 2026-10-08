/* eslint-disable sort-keys-custom-order/object-keys */
/**
 * NODE: operation node (pure data, no execution flow).
 *
 * A node is an "operation" when it has no exec input. Each method is keyed by a data output and
 * returns that output's value. Values are computed lazily, when something reads the output.
 *
 * Operation nodes can have several outputs: add one method per output (see `out_difference`).
 * Keep the methods pure (no side effects), because they may run any number of times.
 *
 * Docs: docs/04-nodes.md
 */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const operationNode = makeLogicNode({
    name: "examples/operation",
    inputs: {
        in_a: LogicType.number({ name: "A" }),
        in_b: LogicType.number({ name: "B" })
    },
    outputs: {
        out_sum: LogicType.number({ name: "A + B" }),
        out_difference: LogicType.number({ name: "A - B" })
    },
    methods: {
        out_sum() {
            return this.in_a + this.in_b;
        },
        out_difference() {
            return this.in_a - this.in_b;
        }
    },
    display: {
        name: "Add (operation)"
    },
    documentation: {
        short: "Sum and difference of two numbers",
        description: "Example of an operation node: outputs are computed on demand from the inputs."
    }
});
