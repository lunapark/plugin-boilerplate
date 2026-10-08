/* eslint-disable sort-keys-custom-order/object-keys */
/**
 * Plugin entry point: the module the Luna Park editor loads.
 *
 * The default export must be the result of `makePlugin({...})`. This file only puts the
 * features together, each of which lives in `src/features/<name>/` with its own README.md.
 * To drop a feature, delete its folder and the lines that mention it below.
 *
 * Option forms (see docs/02-plugin-manifest.md):
 * - top-level keys (`id`, `name`, `icon`, `config`, `internals`, `lifecycle`, `hooks`,
 *   `settings`, `windows`, `llm`, ...) are plain values;
 * - every key under `editor`, `build` and `inject` can be a value **or** a (possibly async)
 *   function of `env` = `{ config, internals, mode, app, ... }`. The editor re-evaluates these
 *   functions when config or internals change. The compiler calls them with `mode: "build"`.
 *
 * Docs: README.md, AGENTS.md, docs/
 */
import { makePlugin } from "@luna-park/plugin";

import { getBackendInjections, getEnv, packageImport } from "@/features/backend/build.ts";
import { backendNodes } from "@/features/backend/nodes.ts";
import { components } from "@/features/components/index.ts";
import { applyConfig, configSchema, getConfigInjections } from "@/features/config/index.ts";
import { ensureFiles, saveGreetingNode } from "@/features/files/index.ts";
import { guards } from "@/features/guards/index.ts";
import { getHooksInjections, hooks } from "@/features/hooks/index.ts";
import { inputs } from "@/features/inputs/index.ts";
import { addMoneyNode, interfaces } from "@/features/interfaces/index.ts";
import type { TInternals } from "@/features/internals/index.ts";
import { internals, settings } from "@/features/internals/index.ts";
import { exampleNodes } from "@/features/nodes/index.ts";
import { elementPanels } from "@/features/panel/index.ts";
import { templates } from "@/features/templates/index.ts";
import { getInjectedCss, tokens } from "@/features/tokens/index.ts";
import { windows, windowsSettings } from "@/features/windows/index.ts";
import { getWrapper, getWrapperInjections } from "@/features/wrapper/index.ts";
import { log, setEnv } from "@/lib/env.ts";
import { mergeInjections } from "@/lib/injections.ts";
import llm from "@/llm.md?raw";
import icon from "@/logo.svg";
import { PLUGIN_ID } from "@/meta.ts";

export default makePlugin<typeof configSchema, TInternals>({
    // ─── Identity ───────────────────────────────────────────────────────────────────────────
    /** Unique and stable: projects store the plugin's data under this id. */
    id: PLUGIN_ID,
    name: "Boilerplate",
    description: "A documented example of every Luna Park plugin feature.",
    /** URL or data URI. An imported SVG becomes a data URI or an asset URL. */
    icon,
    /** Optional tint for the plugin's elements in the layout tree. */
    color: "#ff6600",
    /** Markdown read by the AI assistant (Sidekick) to understand and use the plugin. */
    llm,

    // ─── User settings ──────────────────────────────────────────────────────────────────────
    /** Typed config form (features/config). Values reach `env.config`. */
    config: configSchema,
    /** Persisted free-form state (features/internals). Values reach `env.internals`. */
    internals,
    /** Custom tabs in the plugin's settings popup. */
    settings: [...settings, ...windowsSettings],

    // ─── Lifecycle (editor only) ────────────────────────────────────────────────────────────
    lifecycle: {
        /** Once the plugin is installed or loaded. The full `env` is available. */
        mount: (env) => {
            setEnv(env);
            applyConfig(env.config);
            ensureFiles();

            if (env.config.debug) {
                log("Boilerplate plugin mounted");
            }
        },
        /** After mount and on every config change. */
        update: (env) => {
            setEnv(env);
            applyConfig(env.config);

            if (env.config.debug) {
                log(`Boilerplate config updated: ${ JSON.stringify(env.config) }`);
            }
        },
        /** When the plugin is removed or the editor closes: clean up global side effects. */
        unmount: () => {
            document.documentElement.style.removeProperty("--bp-color-accent");
            document.documentElement.style.removeProperty("--bp-spacing");
        }
    },

    // ─── Editor contributions ───────────────────────────────────────────────────────────────
    editor: {
        components,
        nodes: [
            ...exampleNodes,
            ...backendNodes,
            saveGreetingNode,
            addMoneyNode
        ],
        tokens,
        panel: {
            element: elementPanels
        },
        inputs,
        interfaces,
        guards,
        templates,
        /** Function form: a different wrapper for the editor and for builds. */
        wrapper: getWrapper
    },

    /** Simulated-backend hooks (features/hooks). Mirrored in production by getHooksInjections. */
    hooks,

    /** Standalone pages at /plugin?plugin=<target>&window=<key> (features/windows). */
    windows,

    // ─── Global injections into the editor and the built app ─────────────────────────────────
    inject: {
        css: getInjectedCss
    },

    // ─── Build (code generation of the exported app) ─────────────────────────────────────────
    build: {
        frontImports: [packageImport],
        backImports: [packageImport],
        env: getEnv,
        injections: (env) => mergeInjections(
            getConfigInjections(env.config),
            getWrapperInjections(),
            getBackendInjections(env),
            getHooksInjections(env)
        )
    }
});
