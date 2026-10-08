/**
 * COMPONENT: scoped slots, dynamic slots and LLM docs.
 *
 * - Scoped slot: give the slot an object schema. Its properties become variables available to
 *   the elements placed inside the slot (`item`, `index` below).
 * - Dynamic slots: `slots` can be a function of the current property values. It receives
 *   `{ [prop]: { schema, value }, internals }` and returns the slot record, so slots can come and
 *   go, or be typed from the props (see the Nuxt UI plugin's Table for a full example).
 * - `llm`: Markdown for the AI assistant, imported raw with `?raw`. Explain how to use the
 *   component, not how it is implemented.
 *
 * Docs: docs/05-components.md
 */
import { faList } from "@fortawesome/free-solid-svg-icons";
import type { TComponent } from "@luna-park/plugin";
import { LogicType } from "@luna-park/plugin";

import BpList from "@/features/components/BpList.vue";
import llm from "@/features/components/list.md?raw";
import { RUNTIME_TARGET } from "@/meta.ts";

const properties = {
    items: LogicType.array(LogicType.string(), { default: () => ["Flux capacitor", "DeLorean"] }),
    showEmpty: LogicType.boolean({ default: true, description: "Show the `empty` slot when there are no items." })
};

export const list = {
    name: "Boilerplate/List",
    build: {
        name: "BpList",
        imports: [{ name: "BpList", from: RUNTIME_TARGET }]
    },
    component: BpList,
    documentation: {
        description: "A bullet list with a customisable item template."
    },
    icon: faList,
    llm,
    properties,
    // The argument is loosely typed (`Record<string, { schema, value }>`), so read props defensively
    slots: ({ showEmpty }) => ({
        item: LogicType.object({
            index: LogicType.number({ name: "index" }),
            item: LogicType.string({ name: "item" })
        }),
        // Only offered while the `showEmpty` property is enabled
        ...(showEmpty?.value === false ? {} : { empty: LogicType.void() })
    })
} satisfies TComponent;
