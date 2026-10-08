/**
 * NODE: per-instance node config.
 *
 * `config` declares settings stored on each node instance (`node.data.config`) and edited in the
 * node inspector. Unlike inputs, they are not pins: use them for options fixed at design time.
 *
 * - In methods: `this.config.<key>` (typed).
 * - In `build.generate({ config })`: inline the values into the generated code.
 *
 * Docs: docs/04-nodes.md
 */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const nodeConfigNode = makeLogicNode({
    name: "examples/format-list",
    inputs: {
        in_items: LogicType.array(LogicType.string(), { name: "items" })
    },
    outputs: {
        out_text: LogicType.string({ name: "text" })
    },
    config: {
        separator: LogicType.string({ name: "Separator", default: ", " }),
        uppercase: LogicType.boolean({ name: "Uppercase", default: false })
    },
    methods: {
        out_text() {
            const text = (this.in_items ?? []).join(this.config.separator ?? ", ");
            return this.config.uppercase ? text.toUpperCase() : text;
        }
    },
    display: {
        name: "Format list (node config)"
    },
    documentation: {
        short: "Join strings with a configurable separator",
        description: "Example of node config: the separator and casing are set in the inspector, not through pins."
    },
    build: {
        /*
         * The values are baked into the generated code, so the app doesn't need to read config at
         * runtime. For an operation node, `generate` returns a function expression whose body uses
         * `this.in_*`, like the method above.
         */
        generate: ({ config }) => `function () {
            const text = (this.in_items ?? []).join(${ JSON.stringify(config?.separator ?? ", ") });
            return ${ config?.uppercase ? "text.toUpperCase()" : "text" };
        }`
    }
});
