/**
 * FEATURE: UI components (`editor.components`).
 *
 * Each component is a pair: a regular Vue SFC (`Bp*.vue`) and a `TComponent` description
 * (`*.ts`). The Vue files are also exported from the runtime entry (src/entries/runtime.ts),
 * which the compiled app imports through `build.imports`.
 *
 * `editor.components` can also be an async function of `env` (`async (env) => [...]`), e.g.
 * to auto-register every file with `import.meta.glob` (the Nuxt UI plugin does this).
 *
 * Docs: docs/05-components.md
 */
import type { TComponent } from "@luna-park/plugin";

import { card } from "@/features/components/card.ts";
import { counter } from "@/features/components/counter.ts";
import { list } from "@/features/components/list.ts";

export const components: Array<TComponent> = [
    card,
    list,
    counter
];
