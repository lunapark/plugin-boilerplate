/**
 * RUNTIME code: runs in the editor preview and in the generated frontend.
 *
 * It is exported from src/entries/runtime.ts (published as `<package>/runtime`). Runtime code must
 * not import editor-only modules (`@luna-park/design`, src/lib/env.ts, ...), because the
 * generated app does not have them.
 *
 * Writing the config to CSS variables on `:root` lets every component (and the user's own
 * styles) react to it without JavaScript.
 */
import { reactive } from "vue";

import { CSS_PREFIX } from "@/meta.ts";

export type TBoilerplateConfig = {
    accent: string;
    debug: boolean;
    density: string;
    greeting: string;
    spacing: number;
};

/** Reactive copy of the config, readable by runtime components. */
export const boilerplateConfig = reactive<TBoilerplateConfig>({
    accent: "#ff6600",
    debug: false,
    density: "comfortable",
    greeting: "Marty McFly",
    spacing: 8
});

export function configureBoilerplate(config: Partial<TBoilerplateConfig>) {
    Object.assign(boilerplateConfig, config);

    if (typeof document === "undefined") {
        return;
    }

    const root = document.documentElement.style;
    root.setProperty(`${ CSS_PREFIX }-color-accent`, boilerplateConfig.accent);
    root.setProperty(`${ CSS_PREFIX }-spacing`, `${ boilerplateConfig.spacing }px`);
}
