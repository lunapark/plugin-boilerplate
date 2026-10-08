/* eslint-disable sort-keys-custom-order/object-keys */
/**
 * FEATURE: custom interfaces (`editor.interfaces`), i.e. class types.
 *
 * An interface registers a named class type that schemas can use with
 * `LogicType.interface("Money")`. It shows as its own pin colour and type in the editor.
 * - `name`: global type name. Interfaces from all plugins share one namespace, so pick a
 *   distinctive name.
 * - `class`: the JS class, used for `instanceof` checks.
 * - `extends`: parent interface names. A `CalendarDate` pin accepts `DateValue` wires, for example.
 * - `description`, `methods`, `arguments`: documentation for users and the AI assistant.
 * - `constant`: how users type a literal value.
 *   - `editor`: Vue component used to type it (see LMoneyInput.vue);
 *   - `parse`: serialisable value → instance (editor);
 *   - `serialize`: instance → serialisable value;
 *   - `build.generate(code)`: JS expression that recreates the instance in the generated app,
 *     where `code` is the JSON of the constant;
 *   - `build.imports`: imports needed by that expression.
 *
 * Docs: docs/08-inputs-and-interfaces.md
 */
import type { TInterface } from "@luna-park/plugin";
import { LogicType, makeLogicNode } from "@luna-park/plugin";
import { markRaw } from "vue";

import LMoneyInput from "@/features/interfaces/LMoneyInput.vue";
import { Money } from "@/features/interfaces/money.ts";
import { SHARED_TARGET } from "@/meta.ts";

export const moneyInterface: TInterface = {
    name: "Money",
    class: Money as unknown as TInterface["class"],
    description: "An amount of money in a given currency (e.g. `12.50 EUR`).",
    methods: [
        { name: "format", parameters: [LogicType.string({ name: "locale", optional: true })], return: LogicType.string() },
        { name: "add", parameters: [LogicType.interface("Money", { name: "other" })], return: LogicType.interface("Money") }
    ],
    constant: {
        editor: markRaw(LMoneyInput),
        parse: (value) => Money.parse(String(value)),
        serialize: (instance) => String(instance),
        build: {
            generate: (code) => `Money.parse(${ code })`,
            imports: [{ name: "Money", target: SHARED_TARGET }]
        }
    }
};

export const interfaces: Array<TInterface> = [moneyInterface];

/** Schema helper so nodes and properties get the right TS type (`Money`). */
export function moneyType(args: Parameters<typeof LogicType.interface<Money>>[1] = {}) {
    return LogicType.interface<Money>("Money", args);
}

/** A node using the interface: pins get the Money type and constant editor. */
export const addMoneyNode = makeLogicNode({
    name: "examples/add-money",
    inputs: {
        in_a: moneyType({ name: "A" }),
        in_b: moneyType({ name: "B" })
    },
    outputs: {
        out_total: moneyType({ name: "total" }),
        out_label: LogicType.string({ name: "label" })
    },
    methods: {
        out_total() {
            return this.in_a.add(this.in_b);
        },
        out_label() {
            return this.in_a.add(this.in_b).format();
        }
    },
    display: {
        name: "Add money (interface)"
    },
    documentation: {
        short: "Add two amounts of the same currency",
        description: "Example node using the custom `Money` interface."
    },
    build: {
        // Methods only call instance methods (`.add`, `.format`), so they need no import, but
        // writing the code out keeps it independent of how the bundler renamed things.
        generate: ({ key }) => key === "out_label" ? "function () { return this.in_a.add(this.in_b).format(); }" : "function () { return this.in_a.add(this.in_b); }"
    }
});
