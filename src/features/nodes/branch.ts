/**
 * NODE: function node with several exec outputs (branching).
 *
 * A function node can call any of its exec outputs (or none, or several in sequence). This one
 * routes the flow depending on a condition.
 *
 * Node-local state: `this.internal_<anything>` holds scratch values for this node instance
 * (here: how many times each branch ran), and `this.cache` keeps an object across runs.
 *
 * About macros: a node with *several exec inputs* (one method per input) is a "macro". The editor
 * runs macros, but the compiler can't generate code for plugin macros yet. Use one function node
 * per entry point instead.
 *
 * Docs: docs/04-nodes.md
 */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export const branchNode = makeLogicNode({
    name: "examples/is-even",
    inputs: {
        in_exec: LogicType.exec(),
        in_value: LogicType.number({ name: "value" })
    },
    outputs: {
        out_even: LogicType.exec({ name: "even" }),
        out_odd: LogicType.exec({ name: "odd" }),
        out_runs: LogicType.number({ name: "runs" })
    },
    methods: {
        // Not `async`: the method returns the exec output's call instead of awaiting it (faster).
        in_exec() {
            this.internal_runs = (this.internal_runs as number ?? 0) + 1;
            this.out_runs = this.internal_runs as number;

            if (this.in_value % 2 === 0) {
                return this.out_even();
            }
            else {
                return this.out_odd();
            }
        }
    },
    display: {
        name: "Is even (branch)"
    },
    documentation: {
        short: "Continue on 'even' or 'odd'",
        description: "Example of a function node with two exec outputs: the flow continues on one of them."
    }
});
