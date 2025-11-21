import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const myOperationNode = makeLogicNode({
    display: {
        name: "My Operation Node"
    },
    inputs: {
        in_a: LogicType.number(),
        in_b: LogicType.number()
    },
    methods: {
        out_result() {
            return this.in_a + this.in_b;
        }
    },
    name: "operation-node",
    outputs: {
        out_result: LogicType.number()
    }
});
