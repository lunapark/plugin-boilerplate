/* eslint-disable sort-keys-custom-order/object-keys */
/**
 * NODES: code generation (`build`).
 *
 * In the editor, nodes run their `methods`. When the project is compiled, each node becomes
 * JavaScript in the generated app:
 * - without `build.generate`, the compiler copies the source of the first method. It must be
 *   self-contained: no imported helpers, no closures over module variables, because bundling
 *   may rename them;
 * - with `build.generate(data)`, you return that code as a string. It is a function expression
 *   that uses `this.in_*` / `this.out_*` just like a method;
 * - `build.imports`: `[{ name, target }]` adds `import { name } from "target"` to the generated
 *   file. The target is usually your own `<package>/runtime|server|shared` entry (declare the
 *   package in `build.frontImports` / `backImports` so it is installed), a third-party package,
 *   or a module of the generated app (`@/utils/api`, `@/utils/lib.ts`, ...);
 * - `build.define`: module-level statements emitted once per generated component, for
 *   operation nodes used in components. `[[<id>]]` placeholders are replaced by a unique
 *   variable name;
 * - `[[file:<fileId>]]` in generated code becomes an import of that project file (see
 *   features/files).
 *
 * `generate` receives `{ config, id, inputKeys, key }`:
 * - `config`: the node's config values;
 * - `id`: a unique variable name for this node instance;
 * - `inputKeys`: the inputs that have a value;
 * - `key`: the output being generated (operation nodes).
 *
 * Docs: docs/04-nodes.md, docs/11-build-and-codegen.md
 */
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { slugify, useWindowWidth } from "@/features/nodes/runtime.ts";
import { RUNTIME_TARGET } from "@/meta.ts";

/** Operation node that calls a runtime helper. */
export const slugifyNode = makeLogicNode({
    name: "examples/slugify",
    inputs: {
        in_text: LogicType.string({ name: "text" })
    },
    outputs: {
        out_slug: LogicType.string({ name: "slug" })
    },
    methods: {
        out_slug() {
            return slugify(this.in_text ?? "");
        }
    },
    display: {
        name: "Slugify (codegen)",
        config: {
            scope: ELogicScope.Frontend
        }
    },
    documentation: {
        short: "Turn text into a URL-friendly slug",
        description: "Example of `build.generate` + `build.imports`: the generated app imports `slugify` from the plugin runtime."
    },
    build: {
        generate: () => "function () { return slugify(this.in_text ?? \"\"); }",
        imports: [{ name: "slugify", target: RUNTIME_TARGET }]
    }
});

/**
 * Reactive operation node: `this.instance(deps, factory, key?)` memoizes one value per node
 * instance (and per set of deps). Wrapping a composable in it creates a single listener that
 * stays reactive.
 * The generated equivalent is `useInstances()` from the generated app's `@/utils/lib.ts`,
 * declared once per component with `build.define`.
 */
export const reactiveNode = makeLogicNode({
    name: "examples/window-width",
    inputs: {},
    outputs: {
        out_width: LogicType.number({ name: "width" })
    },
    methods: {
        out_width() {
            return this.instance([], () => useWindowWidth()).value;
        }
    },
    display: {
        name: "Window width (reactive)",
        config: {
            scope: ELogicScope.Frontend
        }
    },
    documentation: {
        short: "Read the window width, updated live",
        description: "Example of a reactive node using `this.instance` and `build.define`."
    },
    build: {
        define: [{
            id: () => "instance",
            values: () => "const [[instance]] = useInstances();"
        }],
        generate: ({ id }) => `() => { return [[instance]]([], () => useWindowWidth(), ${ JSON.stringify(id) }).value; }`,
        imports: [
            { name: "useWindowWidth", target: RUNTIME_TARGET },
            { name: "useInstances", target: "@/utils/lib.ts" }
        ]
    }
});
