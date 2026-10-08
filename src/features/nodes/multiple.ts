/**
 * NODE: variadic input (`multiple: true`).
 *
 * An array input with `multiple: true` becomes a list of pins, and the user adds or removes them
 * on the node. In the method you read it back as a normal array (`this.in_values` is `string[]`).
 * The item schema (`LogicType.string()` here) types each pin.
 *
 * Docs: docs/04-nodes.md, docs/03-type-system.md
 */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const multipleNode = makeLogicNode({
    name: "examples/concat",
    inputs: {
        in_values: LogicType.array(LogicType.string({ name: "value" }), { name: "values", multiple: true })
    },
    outputs: {
        out_text: LogicType.string({ name: "text" })
    },
    methods: {
        out_text() {
            return (this.in_values ?? []).join("");
        }
    },
    display: {
        name: "Concat (variadic)"
    },
    documentation: {
        short: "Join any number of strings",
        description: "Example of a `multiple` input: add as many value pins as needed."
    }
});
