/**
 * FEATURE: `internals`, the plugin's persisted, free-form state.
 *
 * - Pass this object to `makePlugin({ internals })`.
 * - At load time the editor copies the values saved in the project (`app.config.plugins[id].internals`)
 *   into it with a **shallow** `Object.assign`, and saves it back when it changes.
 * - Make it `reactive()` so Vue settings tabs can bind to it with `v-model`.
 * - Option functions receive it as `env.internals`. Other code can import it directly.
 *
 * Every field needs a default here, because older projects may have saved fewer fields
 * (fill in missing ones in `lifecycle.mount` when needed).
 *
 * See docs/09-config-internals-settings-windows.md.
 */
import { reactive } from "vue";

export type TCategory = {
    id: string;
    label: string;
};

export type TInternals = {
    /**
     * Secret used by the backend example. Stored in the project, but at build time it is
     * written to `.env` and never inlined into the generated code (see features/backend).
     */
    apiKey: string;
    /** Drives a dynamic enum in a node (see features/nodes/dynamic.ts). */
    categories: Record<string, TCategory>;
    /** Ids of the project files the plugin created (see features/files). */
    files: {
        notes?: string;
        store?: string;
    };
    /** Free text edited in the settings tab. */
    signature: string;
};

export const internals = reactive<TInternals>({
    apiKey: "",
    categories: {
        news: { id: "news", label: "News" },
        tips: { id: "tips", label: "Tips" }
    },
    files: {},
    signature: "Sent from Luna Park"
});
