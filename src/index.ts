import { LogicType, makePlugin } from "@luna-park/plugin";

import { myComponent } from "@/components/myComponent.ts";
import { myFunctionNode } from "@/nodes/myFunctionNode.ts";
import { myOperationNode } from "@/nodes/myOperationNode.ts";
import style from "@/style.css?inline";
import { colorTokens } from "@/tokens/color.ts";
import { lengthTokens } from "@/tokens/length.ts";

import LWrapper from "./components/LWrapper.vue";
import icon from "./logo.svg";

export default makePlugin({
    config: LogicType.object({
        name: LogicType.string({ default: "Marty McFly" })
    }),
    description: "Example plugin",
    editor: {
        components: [
            myComponent
        ],
        nodes: [
            myFunctionNode,
            myOperationNode
        ],
        tokens: [
            ...colorTokens,
            ...lengthTokens
        ],
        wrapper: LWrapper
    },
    icon,
    id: "boilerplate",
    inject: {
        css: style
    },
    lifecycle: {
        mount: () => {
            console.log("Boilerplate plugin mounted!");
        },
        update: ({ config }) => {
            console.log(`Hello ${ config.name }`);
        }
    },
    name: "Boilerplate"
});
