/**
 * COMPONENT: properties, enums, tokens, named slots, documentation, compiled import.
 *
 * A `TComponent` describes an existing Vue component to the editor:
 * - `name`: "Folder/Name". The part before the last `/` is the folder in the element picker.
 *   Placed instances are referenced as `<pluginId>><name>`, so never rename it once published;
 * - `component`: the Vue component rendered in the editor canvas;
 * - `properties`: one schema per prop. The inspector builds its inputs from them;
 * - `slots`: one schema per slot. `LogicType.void()` is a plain slot, an object schema is a
 *   scoped slot (see ./list.ts);
 * - `build`: how the compiled app gets the component. **Required for exported apps.** `name` is
 *   the tag written in the template, and `imports` the import statements added to the file.
 *   Without it the generated template uses a tag nothing defines;
 * - `documentation`, `icon`, `llm`: help for users and for the AI assistant.
 *
 * `satisfies TComponent` keeps the literal types while checking the shape.
 *
 * Docs: docs/05-components.md
 */
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import type { TComponent } from "@luna-park/plugin";
import { ETokenType, LogicType } from "@luna-park/plugin";

import BpCard from "@/features/components/BpCard.vue";
import { swatchType } from "@/features/inputs/index.ts";
import { RUNTIME_TARGET } from "@/meta.ts";

export const card = {
    build: {
        // Named import: `import { BpCard } from "<package>/runtime"`. Use `default: true` for default exports.
        imports: [{ from: RUNTIME_TARGET, name: "BpCard" }],
        name: "BpCard"
    },
    component: BpCard,
    documentation: {
        description: "A container with a title, a body and an optional footer.",
        link: "https://github.com/lunapark/plugin-boilerplate/tree/main/src/features/components"
    },
    icon: faSquare,
    name: "Boilerplate/Card",
    properties: {
        // Edited with the plugin's custom swatch input (features/inputs)
        color: swatchType({ description: "Overrides the accent color.", optional: true }),
        elevated: LogicType.boolean({ default: false, description: "Add a drop shadow." }),
        // `options.token` lets the user pick a design token (yours from features/tokens, or the app's)
        padding: LogicType.string({ optional: true, options: { token: ETokenType.Length } }),
        title: LogicType.string({ description: "Shown above the content.", placeholder: "Card title" }),
        // Array enum: dropdown whose labels are the values
        variant: LogicType.string({ default: "outline", enum: ["outline", "soft", "solid"] })
    },
    slots: {
        default: LogicType.void(),
        footer: LogicType.void()
    }
} satisfies TComponent;
