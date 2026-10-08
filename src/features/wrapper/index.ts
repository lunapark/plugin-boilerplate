/**
 * FEATURE: app wrapper (`editor.wrapper`).
 *
 * The wrapper is a component that surrounds the whole app.
 * - Editor: rendered around the canvas with `h(wrapper.component)` (no attributes).
 * - Exported app: the compiler writes `<${wrapper.name} ...attributes>` around `<RouterView/>` in
 *   `App.vue`. It does **not** import the component, so it has to be registered globally, which
 *   the AppImport + AppBody injections below do.
 *
 * Like every `editor.*` option, `wrapper` can be a function of `env`. `env.mode` tells whether
 * it is for the editor or for a build, so each can use a different component or attributes.
 * With several plugins, wrappers are nested in plugin order.
 *
 * Docs: docs/02-plugin-manifest.md, docs/11-build-and-codegen.md
 */
import type { TBasePlugin } from "@luna-park/plugin";
import { EInjectionKey } from "@luna-park/plugin";

import type { TConfig } from "@/features/config/index.ts";
import BpWrapper from "@/features/wrapper/BpWrapper.vue";
import type { TInjections } from "@/lib/injections.ts";
import { RUNTIME_TARGET } from "@/meta.ts";

type TWrapper = NonNullable<NonNullable<TBasePlugin["editor"]>["wrapper"]>;

/** Global component name, shared by the wrapper definition and the AppBody registration. */
const WRAPPER_NAME = "BpWrapper";

export function getWrapper({ config, mode }: { config: TConfig; mode: "build" | "editor"; }): TWrapper {
    if (mode === "build") {
        return {
            name: WRAPPER_NAME,
            attributes: { density: config.density },
            component: BpWrapper
        };
    }

    return { name: WRAPPER_NAME, component: BpWrapper };
}

/** Registers the wrapper globally in the generated `main.ts`, where `app` is in scope. */
export function getWrapperInjections(): TInjections {
    return {
        [EInjectionKey.AppImport]: `import { BpWrapper } from "${ RUNTIME_TARGET }";`,
        [EInjectionKey.AppBody]: `app.component("${ WRAPPER_NAME }", BpWrapper);`
    };
}
