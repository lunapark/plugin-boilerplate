/**
 * FEATURE: `internals` plus `settings` tabs.
 *
 * - `internals`: a reactive object that is saved with the project (see ./internals.ts).
 * - `settings`: tabs in the plugin's configuration popup. Each one is a Vue component that edits `internals`.
 *
 * `shallowRef` keeps Vue from making the component definition deeply reactive. It is what the
 * official plugins do, and `markRaw(Component)` works too.
 *
 * See docs/09-config-internals-settings-windows.md.
 */
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import type { TBasePlugin } from "@luna-park/plugin";
import { shallowRef } from "vue";

import LSettings from "@/features/internals/LSettings.vue";

export { internals, type TInternals } from "@/features/internals/internals.ts";

export const settings: NonNullable<TBasePlugin["settings"]> = [
    {
        component: shallowRef(LSettings),
        // A Font Awesome IconDefinition, or a string (URL / data URI)
        icon: faSliders,
        label: "General"
    }
];
