/**
 * FEATURE: design tokens (`editor.tokens`) and global CSS (`inject.css`).
 *
 * A token is a named value that users can pick in style inputs of the matching type (colour
 * pickers, length fields, font selectors, ...) and in properties declared with
 * `options: { token: ETokenType.X }`.
 * - Reference saved in the project: `plugin/<pluginId>/<token.id>`. Keep ids stable.
 * - When compiled, the token's `value` is written into the CSS as-is. Pointing it at a CSS
 *   variable (`var(--bp-...)`) lets the plugin or the user theme it later.
 *
 * All 6 token types are shown below.
 *
 * Docs: docs/06-styling-and-tokens.md
 */
import type { TToken } from "@luna-park/plugin";
import { ETokenType } from "@luna-park/plugin";

import type { TConfig } from "@/features/config/index.ts";
import tokensCss from "@/features/tokens/tokens.css?inline";

export const tokens = [
    { id: "accent", name: "Accent", type: ETokenType.Color, value: "var(--bp-color-accent)" },
    { id: "ink", name: "Ink", type: ETokenType.Color, value: "var(--bp-color-ink)" },

    { id: "length-s", name: "Length S", type: ETokenType.Length, value: "var(--bp-length-s)" },
    { id: "length-m", name: "Length M", type: ETokenType.Length, value: "var(--bp-length-m)" },
    { id: "length-l", name: "Length L", type: ETokenType.Length, value: "var(--bp-length-l)" },
    { id: "radius", name: "Radius", type: ETokenType.Length, value: "var(--bp-radius)" },

    { id: "font-size-s", name: "Small text", type: ETokenType.FontSize, value: "var(--bp-font-size-s)" },
    { id: "font-size-l", name: "Large text", type: ETokenType.FontSize, value: "var(--bp-font-size-l)" },

    { id: "font-weight-bold", name: "Bold", type: ETokenType.FontWeight, value: "var(--bp-font-weight-bold)" },

    { id: "font-family-mono", name: "Monospace", type: ETokenType.FontFamily, value: "var(--bp-font-family-mono)" },

    { id: "time-fast", name: "Fast", type: ETokenType.Time, value: "var(--bp-time-fast)" },
    { id: "time-slow", name: "Slow", type: ETokenType.Time, value: "var(--bp-time-slow)" }
] satisfies Array<TToken>;

/**
 * `inject.css` can be a string or a function of `env`, like other `inject.*` options.
 * Here the config is appended so tokens follow the configured accent and spacing.
 * With `?inline`, Vite gives the CSS as a string instead of injecting it in the page.
 */
export function getInjectedCss({ config, mode }: { config: TConfig; mode: "build" | "editor"; }) {
    const overrides = `:root { --bp-color-accent: ${ config.accent }; --bp-spacing: ${ config.spacing }px; }`;

    // `mode` tells whether the CSS goes into the editor or into an exported app.
    return mode === "build" ? `/* Boilerplate plugin */\n${ tokensCss }\n${ overrides }` : `${ tokensCss }\n${ overrides }`;
}
