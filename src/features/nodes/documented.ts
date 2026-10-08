/* eslint-disable sort-keys-custom-order/object-keys */
/**
 * NODE: display options and documentation.
 *
 * `display` changes how the node looks and is found in the editor:
 * - `name`: title shown on the node and in search;
 * - `altSearch`: extra search keywords;
 * - `config.icon` / `config.back`: header icon / large background icon (IconDefinition or string);
 * - `config.hue`: header colour (0-360);
 * - `config.headerless`, `config.transparent`, `config.data.size`: compact visual variants;
 * - `config.scope`: where the node may run (see ./scopes.ts).
 *
 * `documentation` is shown in the node's help, and the AI assistant (Sidekick) reads it too.
 * Good docs make your nodes usable by humans and LLMs alike:
 * - `short`: one line, imperative ("Convert…", "Send…");
 * - `description`: full Markdown description;
 * - `parameters`: one entry per notable input/output;
 * - `examples`: input → output pairs;
 * - `dynamics`: explain dynamic pins, if any.
 *
 * Docs: docs/04-nodes.md
 */
import { faTemperatureHalf, faTemperatureThreeQuarters } from "@fortawesome/free-solid-svg-icons";
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const documentedNode = makeLogicNode({
    name: "examples/celsius-to-fahrenheit",
    inputs: {
        in_celsius: LogicType.number({ name: "°C", description: "Temperature in degrees Celsius" })
    },
    outputs: {
        out_fahrenheit: LogicType.number({ name: "°F" })
    },
    methods: {
        out_fahrenheit() {
            return this.in_celsius * 9 / 5 + 32;
        }
    },
    display: {
        name: "Celsius to Fahrenheit",
        altSearch: "temperature convert degrees",
        config: {
            hue: 20,
            icon: faTemperatureHalf,
            back: faTemperatureThreeQuarters
        }
    },
    documentation: {
        short: "Convert a temperature from °C to °F",
        description: "Computes `°F = °C × 9/5 + 32`.",
        parameters: [
            { name: "in_celsius", description: "The temperature to convert, in degrees Celsius." },
            { name: "out_fahrenheit", description: "The converted temperature, in degrees Fahrenheit." }
        ],
        examples: [
            { inputs: [{ key: "in_celsius", value: 0 }], outputs: [{ key: "out_fahrenheit", value: 32 }] },
            { inputs: [{ key: "in_celsius", value: 100 }], outputs: [{ key: "out_fahrenheit", value: 212 }] }
        ]
    }
});
