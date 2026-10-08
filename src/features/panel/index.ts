/**
 * FEATURE: element panel (`editor.panel.element`) + Vue directive.
 *
 * An element panel adds a section to the inspector of **every** layout element (div, text,
 * components, ...), which `filter` can narrow down. Users toggle it per element. Its values are
 * stored on the element in `schema.plugins[<pluginId>]`.
 *
 * - `properties`: schemas from which the inspector builds the form (like component props).
 *   `options.hidden` takes `true` or `(values) => boolean` to hide a field conditionally.
 * - `component`: optional custom UI shown with the form (see LHighlightPanel.vue).
 * - `directive`: what the panel does.
 *   - `value`: the directive used in the editor canvas;
 *   - `build`: `{ from, name }` for exported apps. The compiler imports `name` from `from` and
 *     writes `v-highlight="{...values}"` on the element. Defaults of non-optional properties
 *     are filled in.
 * - `actions`: header buttons. `onClick({ getElements, schema })` runs in the editor.
 *
 * Docs: docs/07-element-panels.md
 */
import { faBolt, faHighlighter } from "@fortawesome/free-solid-svg-icons";
import type { TElementPanel } from "@luna-park/plugin";
import { LogicType } from "@luna-park/plugin";
import { markRaw } from "vue";

import LHighlightPanel from "@/features/panel/LHighlightPanel.vue";
import type { THighlightOptions } from "@/features/panel/runtime.ts";
import { flashElements, vHighlight } from "@/features/panel/runtime.ts";
import { RUNTIME_TARGET } from "@/meta.ts";

export const highlightPanel: TElementPanel = {
    actions: [{
        icon: faBolt,
        onClick: ({ getElements }) => flashElements(getElements()),
        title: "Flash selected element"
    }],
    component: markRaw(LHighlightPanel),
    directive: {
        build: { from: RUNTIME_TARGET, name: "vHighlight" },
        value: vHighlight
    },
    // Don't offer the panel on slot placeholders
    filter: (schema) => schema.element !== "slot",
    icon: faHighlighter,
    id: "highlight",
    label: "Highlight",
    properties: {
        color: LogicType.string({ format: "color", name: "Color", optional: true }),
        // Edited only by the custom component
        intensity: LogicType.number({ default: 2, name: "Intensity", options: { hidden: true } }),
        pulse: LogicType.boolean({
            default: false,
            name: "Pulse",
            optional: true,
            // Conditional visibility: only shown for the "glow" style
            options: { hidden: (values: THighlightOptions) => values.style !== "glow" }
        }),
        style: LogicType.string({ default: "outline", enum: { glow: "Glow", outline: "Outline" }, name: "Style" })
    }
};

export const elementPanels: Array<TElementPanel> = [highlightPanel];
