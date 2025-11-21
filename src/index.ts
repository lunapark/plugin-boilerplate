import { LogicType, makePlugin } from "@luna-park/plugin";

import { myComponent } from "@/components/myComponent.ts";
import { myFunctionNode } from "@/nodes/myFunctionNode.ts";
import { myOperationNode } from "@/nodes/myOperationNode.ts";
import style from "@/style.css?inline";

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
