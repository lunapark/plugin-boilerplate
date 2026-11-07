/**
 * FEATURE: `internals` plus `workspace` sections.
 *
 * - `internals`: a reactive object that is saved with the project (see ./internals.ts).
 * - `workspace.sections`: sections of the plugin's workspace. Each one is a Vue component that edits `internals`.
 *
 * See docs/09-config-internals-settings-windows.md.
 */
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import type { TPluginWorkspaceSection } from "@luna-park/plugin";

import LSettings from "@/features/internals/LSettings.vue";

export { internals, type TInternals } from "@/features/internals/internals.ts";

export const sections: Array<TPluginWorkspaceSection> = [
    {
        id: "general",
        component: LSettings,
        description: "Values stored in the plugin's internals, saved with the project.",
        // A Font Awesome IconDefinition, or a string (URL / data URI)
        icon: faSliders,
        title: "General"
    }
];
