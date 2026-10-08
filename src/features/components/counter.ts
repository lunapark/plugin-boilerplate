/**
 * COMPONENT: models (v-model) and emits (events).
 *
 * - `models`: two-way bindings. Each key is a Vue model name (`modelValue` for plain `v-model`,
 *   or a named model such as `open` for `v-model:open`). The user binds it to a variable or
 *   store value.
 * - `emits`: events the user can attach logic to. The schema types the event payload
 *   (`LogicType.void()` for none).
 *
 * Docs: docs/05-components.md
 */
import { faPlusMinus } from "@fortawesome/free-solid-svg-icons";
import type { TComponent } from "@luna-park/plugin";
import { LogicType } from "@luna-park/plugin";

import BpCounter from "@/features/components/BpCounter.vue";
import { RUNTIME_TARGET } from "@/meta.ts";

export const counter = {
    name: "Boilerplate/Counter",
    build: {
        name: "BpCounter",
        imports: [{ name: "BpCounter", from: RUNTIME_TARGET }]
    },
    component: BpCounter,
    documentation: {
        description: "A number with +/− buttons. Bind its value with v-model."
    },
    emits: {
        change: LogicType.number({ name: "value" }),
        reset: LogicType.void()
    },
    icon: faPlusMinus,
    models: {
        modelValue: LogicType.number({ name: "value" })
    },
    properties: {
        step: LogicType.number({ default: 1, options: { min: 1, step: 1 } })
    }
} satisfies TComponent;
