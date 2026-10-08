# 06 – Styling and tokens

Example: [`src/features/tokens/`](../src/features/tokens)

## Where CSS comes from

| Source | Editor | Exported app |
|--------|--------|--------------|
| Scoped `<style>` in SFCs | injected by `index.js` (vite-plugin-css-injected-by-js) | injected by `runtime.js` |
| `inject.css` (string, or function of `env`) | added to the editor page | appended to `frontend/src/style.css` |
| `EInjectionKey.Style` injection | – | prepended to `frontend/src/style.css` (e.g. `@import "tailwindcss";`) |

Import global CSS with `?inline` (`import css from "./tokens.css?inline"`) so you get a string to pass to `inject.css`, instead of Vite injecting it on its own.

`inject.css` can depend on `env`:
```ts
inject: {
    css: ({ config, mode }) => mode === "editor" ? scopedCss : fullCss + `:root{--bp-accent:${ config.accent }}`
}
```
The Nuxt UI plugin uses the editor mode to rewrite `body` selectors so its CSS doesn't leak into the editor UI.

## Tokens
```ts
import { ETokenType, type TToken } from "@luna-park/plugin";

export const tokens = [
    { id: "accent", name: "Accent", type: ETokenType.Color, value: "var(--bp-color-accent)" }
] satisfies Array<TToken>;
```

| `ETokenType` | Used by |
|---|---|
| `Color` | colour pickers |
| `Length` | sizes, spacing, radius |
| `FontSize` | font size |
| `FontWeight` | font weight |
| `FontFamily` | font family |
| `Time` | durations |

- Projects reference tokens as `plugin/<pluginId>/<id>`, so ids must stay stable.
- When compiled, the token's `value` is written into the CSS as-is. Point it at a CSS variable you define with `inject.css`, so it resolves both in the editor and in the app.
- Properties can offer tokens: `LogicType.string({ options: { token: ETokenType.Length } })`.
- Templates can use them: `{ "type": "token", "token": "plugin/<pluginId>/<id>", "_dynamic": true }`.

## Prefix everything
CSS variables, class names, keyframes, global names and env keys all share one namespace with the app and other plugins. Prefix them (`--bp-`, `.bp-`, `BOILERPLATE_`). See `src/meta.ts`.
