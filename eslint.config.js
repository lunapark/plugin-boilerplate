import lpConfigVue from "@luna-park/eslint-config/vue";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist/*", ".pnpmfile.cjs"]
    },
    ...lpConfigVue,
    {
        rules: {
            "sort-keys-custom-order/object-keys": [
                "error",
                {
                    orderedKeys: ["id", "name"],
                    selectors: [
                        {
                            mode: "direct",
                            orderedKeys: ["id", "name", "description", "icon", "color", "llm", "config", "internals", "settings", "lifecycle", "editor", "hooks", "windows", "inject", "build"],
                            target: { name: "makePlugin", type: "function" }
                        },
                        {
                            mode: "direct",
                            orderedKeys: ["mount", "update", "unmount"],
                            target: { name: "lifecycle", type: "property" }
                        },
                        {
                            mode: "direct",
                            orderedKeys: ["components", "nodes", "tokens", "panel", "inputs", "interfaces", "guards", "templates", "wrapper"],
                            target: { name: "editor", type: "property" }
                        },
                        {
                            mode: "direct",
                            orderedKeys: ["short", "description"],
                            target: { name: "documentation", type: "property" }
                        },
                        {
                            mode: "recursive",
                            sorting: "none",
                            target: { name: "schema", type: "property" }
                        },
                        {
                            mode: "direct",
                            orderedKeys: ["name", "inputs", "outputs", "config", "methods", "display", "documentation", "build"],
                            target: { name: "makeLogicNode", type: "function" }
                        },
                        {
                            mode: "direct",
                            sorting: "none",
                            target: { name: "inputs", type: "property" }
                        },
                        {
                            mode: "direct",
                            sorting: "none",
                            target: { name: "outputs", type: "property" }
                        },
                        {
                            mode: "direct",
                            sorting: "none",
                            target: { name: "methods", type: "property" }
                        }
                    ]
                }
            ]
        }
    }
);
