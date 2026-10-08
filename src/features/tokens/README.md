# Feature: tokens + global CSS

| File | Role |
|------|------|
| `tokens.css` | `:root` CSS variables (`--bp-*`) |
| `index.ts` | `tokens` (one per `ETokenType`) and `getInjectedCss(env)` for `inject.css` |

## Token types

| `ETokenType` | Shown in |
|---|---|
| `Color` | colour pickers (text, background, border…) |
| `Length` | sizes, spacing, radius… |
| `FontSize` | font size |
| `FontWeight` | font weight |
| `FontFamily` | font family |
| `Time` | transition / animation durations |

A property can offer tokens too: `LogicType.string({ options: { token: ETokenType.Length } })` (see `features/components/card.ts`).

## Rules
- Token ids are stored in projects as `plugin/<pluginId>/<id>`. Never rename them.
- Set `value` to `var(--prefix-name)`, define the variable in CSS, and inject that CSS with `inject.css` so it exists in the editor **and** in exported apps.
- Prefix every variable name.

## Remove it
Delete the folder, then remove `tokens` and `inject.css` from `src/index.ts`. The components fall back to their default values.

Docs: [06 – styling & tokens](../../../docs/06-styling-and-tokens.md)
