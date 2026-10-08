/**
 * ENTRY `<package>/runtime`: browser code imported by **generated frontends**.
 *
 * Everything that generated code imports from RUNTIME_TARGET must be exported here:
 * - components: `TComponent.build.imports`;
 * - directives: `TElementPanel.directive.build`;
 * - node helpers: `build.imports` of frontend nodes;
 * - config / wrapper setup called from injections.
 *
 * Rules: browser-safe, no `@luna-park/design`, nothing from src/lib/env.ts. Vue is provided by
 * the app (peer dependency).
 *
 * Docs: docs/14-packaging.md
 */
export { default as BpCard } from "@/features/components/BpCard.vue";
export { default as BpCounter } from "@/features/components/BpCounter.vue";
export { default as BpList } from "@/features/components/BpList.vue";
export { boilerplateConfig, configureBoilerplate, type TBoilerplateConfig } from "@/features/config/runtime.ts";
export { slugify, useWindowWidth } from "@/features/nodes/runtime.ts";
export { flashElements, type THighlightOptions, vHighlight } from "@/features/panel/runtime.ts";
export { default as BpWrapper } from "@/features/wrapper/BpWrapper.vue";

// Shared code is re-exported so frontends can import everything from one entry if they prefer.
export * from "@/entries/shared.ts";
