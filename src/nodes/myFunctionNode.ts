/* eslint-disable sort-keys-custom-order/object-keys */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const myFunctionNode = makeLogicNode({
    display: {
        name: "My Function Node"
    },
    inputs: {
        in_exec: LogicType.exec(),
        in_a: LogicType.number(),
        in_b: LogicType.number()
    },
    methods: {
        async in_exec() {
            this.out_result = this.in_a + this.in_b;
            await this.out_exec();
        }
    },
    name: "function-node",
    outputs: {
        out_exec: LogicType.exec(),
        out_result: LogicType.number()
    }
});
