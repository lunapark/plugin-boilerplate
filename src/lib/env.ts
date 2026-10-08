/**
 * A module-level copy of the editor environment (`TEnv`).
 *
 * Only `lifecycle.*` hooks and option functions (`editor.nodes: (env) => ...`) receive `env`.
 * Node methods, hooks, guards and Vue components don't, so `lifecycle.mount` saves it here
 * (see src/index.ts) and they read it from this module.
 *
 * Use it in editor code only. While the app is compiled ("build" mode), `addFile`, `getFile`,
 * `log` and `backend` don't exist.
 *
 * See docs/10-lifecycle.md.
 */
import type { TEnv } from "@luna-park/plugin";

import type { TConfigSchema } from "@/features/config/index.ts";
import type { TInternals } from "@/features/internals/internals.ts";

export type TPluginEnv = TEnv<TConfigSchema, TInternals>;

export const env: Partial<TPluginEnv> = {};

export function setEnv(value: TPluginEnv) {
    Object.assign(env, value);
}

/** Write to the editor console (the "Console" panel). Falls back to the browser console. */
export function log(message: string, severity: "info" | "warning" | "error" = "info") {
    if (env.log) {
        env.log(message, severity);
        return;
    }

    console.info(`[${ severity }] ${ message }`);
}
