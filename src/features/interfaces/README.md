# Feature: interfaces (class types)

Registers a `Money` type that nodes, properties, variables and database columns can use, with its own constant editor.

| File | Role |
|------|------|
| `money.ts` | The `Money` class, isomorphic and exported from `<package>/shared` |
| `LMoneyInput.vue` | Constant editor (`TInterfaceEditorProps`) |
| `index.ts` | `TInterface` definition, `moneyType()` helper, and the **Add money** node |

## Lifecycle of a constant
```
user types "12.50 EUR" in LMoneyInput ─► stored as "12.50 EUR" (JSON)
editor:        constant.parse("12.50 EUR")  ─► new Money(12.5, "EUR")
exported app:  constant.build.generate('"12.50 EUR"') ─► Money.parse("12.50 EUR")  + import { Money } from "<package>/shared"
```

## Rules
- Interface names are global across plugins. Use specific names.
- The class must be importable from the generated app (shared or runtime entry), otherwise constants can't be rebuilt.
- Use `extends` to make your interface accepted where a parent interface is expected.

## Remove it
Delete the folder, then remove `interfaces` and `addMoneyNode` from `src/index.ts` and the `Money` export from `src/entries/shared.ts`.

Docs: [08 – inputs & interfaces](../../../docs/08-inputs-and-interfaces.md)
