# Boilerplate plugin

Example plugin showing every feature of the Luna Park plugin system. Use it as a reference.

## Components
- **Boilerplate/Card**: container with `title`, `variant` (outline | soft | solid), `elevated`, `color`, `padding`. Slots: `default`, `footer`.
- **Boilerplate/List**: renders `items` (string[]). Scoped slot `item` exposes `{ item, index }`. Slot `empty` exists while `showEmpty` is true.
- **Boilerplate/Counter**: number with +/− buttons. `v-model` is a number, `step` is a property. Events: `change(value)`, `reset`.

## Nodes (prefix `boilerplate/`)
- `examples/*`: demo nodes for flow, operations, config, dynamic types, interfaces (`Money`), scopes and code generation.
- `backend/sign`: backend only. HMAC-signs a text with the plugin's API key.
- `backend/status`: frontend. Calls `GET /_boilerplate/status`.
- `files/save-greeting`: writes into the "Boilerplate Store" file.

## Other
- Element panel **Highlight**: outline or glow on any element.
- Route guards: `boilerplate/known-visitor`, `boilerplate/visitor-allowlist`. Both need the `bp_visitor` cookie.
- Routes receive an `in_visitor` input `{ id, known }`.
- Tokens: colours `accent`, `ink`; lengths `length-s|m|l`, `radius`; font sizes, weights, families and times.
