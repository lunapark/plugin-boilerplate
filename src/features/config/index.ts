/**
 * FEATURE: plugin config (`config`), applied with `lifecycle.update` and `build.injections`.
 *
 * `config` is a `LogicType.object` schema. From it the editor builds a settings form, shown from
 * the plugin's button in the editor header. Values are stored in the project at
 * `app.config.plugins[PLUGIN_ID].config` and reach your code as `env.config`, which is fully typed
 * through `Static<typeof configSchema>`.
 *
 * Choose `config` for simple values a form can edit. For complex state that needs a custom UI,
 * use `internals` plus `settings` instead (see ../internals).
 *
 * The values have to reach three places:
 * - the editor preview: `lifecycle.mount` / `lifecycle.update` call `applyConfig` (see src/index.ts);
 * - the generated app: an `AppSetup` injection calls the same runtime function (`getConfigInjections`);
 * - option functions: `editor.*`, `build.*` and `inject.*` options can be functions of `env`, so they
 *   can read `env.config` directly.
 *
 * Docs: docs/09-config-internals-settings-windows.md, docs/03-type-system.md
 */
import type { Static } from "@luna-park/plugin";
import { EInjectionKey, LogicType } from "@luna-park/plugin";

import { configureBoilerplate } from "@/features/config/runtime.ts";
import type { TInjections } from "@/lib/injections.ts";
import { RUNTIME_TARGET } from "@/meta.ts";

export const configSchema = LogicType.object({
    // `format: "color"` makes the editor show a colour picker
    accent: LogicType.string({
        name: "Accent color",
        default: "#ff6600",
        format: "color"
    }),
    debug: LogicType.boolean({
        name: "Debug",
        default: false,
        description: "Log lifecycle events to the editor console."
    }),
    /*
     * An enum given as an array shows a dropdown whose labels are the values. Given as a
     * Record<value, label> (like here), the label shown differs from the value stored.
     */
    density: LogicType.string({
        name: "Density",
        default: "comfortable",
        enum: { comfortable: "Comfortable", compact: "Compact" }
    }),
    // Plain string with a default value
    greeting: LogicType.string({
        name: "Greeting name",
        default: "Marty McFly",
        description: "Name used by the greeting examples."
    }),
    // Numbers with min/max/step/clamp: the input becomes a slider-like field. `suffix` is display only.
    spacing: LogicType.number({
        name: "Base spacing",
        default: 8,
        options: { clamp: true, max: 32, min: 0, step: 2, suffix: "px" }
    })
});

export type TConfigSchema = typeof configSchema;
export type TConfig = Static<TConfigSchema>;

/** Editor side: called by `lifecycle.mount` and `lifecycle.update` with the current config. */
export function applyConfig(config: TConfig) {
    configureBoilerplate(config);
}

/**
 * Build side: makes the generated app call the same runtime function at startup.
 * `AppSetup` code goes into `<script setup>` of the generated `App.vue`. An `import` there is
 * hoisted as usual.
 */
export function getConfigInjections(config: TConfig): TInjections {
    return {
        [EInjectionKey.AppSetup]: `
import { configureBoilerplate } from "${ RUNTIME_TARGET }";
configureBoilerplate(${ JSON.stringify(config) });
`
    };
}
