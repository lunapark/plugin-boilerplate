/**
 * NODES: dynamic pin types.
 *
 * `dynamic` on a schema is a function that returns the pin's real schema. The editor
 * re-evaluates it when the node's inputs, outputs or config change (and reactively, since it can
 * read reactive state such as `internals`). Its argument is
 * `{ config, inputs: Record<key, TSchema>, outputs: Record<key, TSchema> }`.
 *
 * Two common patterns:
 * 1. Enum from plugin state: the options come from `internals`, which is edited in a settings tab.
 * 2. Generic output: the output type follows whatever is connected to an input.
 *
 * Nodes can also declare `dynamics: { inputs(io), outputs(io) }` to add or replace whole pins
 * (see docs/04-nodes.md).
 */
import type { TSchema } from "@luna-park/plugin";
import { LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/features/internals/internals.ts";

/** Pattern 1: a string input whose dropdown is built from `internals.categories`. */
export const dynamicEnumNode = makeLogicNode({
    name: "examples/pick-category",
    inputs: {
        in_category: LogicType.string({
            name: "Category",
            dynamic: () => LogicType.string({
                name: "Category",
                // Record<value, label>: stores the id, shows the label
                enum: Object.fromEntries(Object.values(internals.categories).map((category) => [category.id, category.label]))
            })
        })
    },
    outputs: {
        out_label: LogicType.string({ name: "label" })
    },
    methods: {
        out_label() {
            return internals.categories[this.in_category]?.label ?? "";
        }
    },
    display: {
        name: "Pick category (dynamic enum)"
    },
    documentation: {
        short: "Choose one of the categories defined in the plugin settings",
        description: "Example of a dynamic enum. Edit the categories in the plugin's General settings tab."
    },
    build: {
        // `internals` doesn't exist in the generated app, so the labels are inlined at build time.
        generate: () => `function () {
            return (${ JSON.stringify(Object.fromEntries(Object.values(internals.categories).map((category) => [category.id, category.label]))) })[this.in_category] ?? "";
        }`
    }
});

/** Pattern 2: the output takes the item type of the connected array. */
export const dynamicTypeNode = makeLogicNode({
    name: "examples/first-item",
    inputs: {
        in_array: LogicType.array(LogicType.unknown(), { name: "array" })
    },
    outputs: {
        out_item: LogicType.unknown({
            name: "item",
            dynamic: ({ inputs }) => (inputs["in_array"] as TSchema & { items?: TSchema; })?.items ?? LogicType.unknown({ name: "item" })
        })
    },
    methods: {
        out_item() {
            return this.in_array?.[0];
        }
    },
    display: {
        name: "First item (generic type)"
    },
    documentation: {
        short: "Get the first element of an array",
        description: "Example of a generic output: its type follows the type of the connected array."
    }
});
