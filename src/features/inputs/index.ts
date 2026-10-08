/**
 * FEATURE: custom property inputs (`editor.inputs`).
 *
 * `editor.inputs` maps a key to a Vue component. The editor registers each one as
 * `<pluginId>/<key>`, and any schema can request it with `options: { input: "<pluginId>/<key>" }`.
 * That works for component properties, panel properties, config fields and node inputs, also
 * from other plugins.
 *
 * `swatchType()` is a helper so schemas don't repeat the input id (the Nuxt UI plugin does
 * the same with `iconType()`).
 *
 * `defineAsyncComponent(() => import(...))` is also accepted and keeps heavy inputs out of the
 * initial bundle.
 *
 * Docs: docs/08-inputs-and-interfaces.md
 */
import { LogicType } from "@luna-park/plugin";
import type { Component } from "vue";
import { markRaw } from "vue";

import LSwatchInput from "@/features/inputs/LSwatchInput.vue";
import { PLUGIN_ID } from "@/meta.ts";

export const inputs: Record<string, Component> = {
    swatch: markRaw(LSwatchInput)
};

/** A string schema edited with the swatch picker. */
export function swatchType(args: Parameters<typeof LogicType.string>[0] = {}) {
    return LogicType.string({
        format: "color",
        ...args,
        options: { ...args.options, input: `${ PLUGIN_ID }/swatch` }
    });
}
