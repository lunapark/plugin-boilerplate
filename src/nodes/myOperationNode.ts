/* eslint-disable sort-keys-custom-order/object-keys */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const myOperationNode = makeLogicNode({
    name: "operation-node",
    inputs: {
        in_a: LogicType.number({ name: "A" }),
        in_b: LogicType.number({ name: "B" })
    },
    outputs: {
        out_result: LogicType.number({ name: "A+B" })
    },
    methods: {
        out_result() {
            return this.in_a + this.in_b;
        }
    },
    display: {
        name: "My Operation Node"
    }
});
