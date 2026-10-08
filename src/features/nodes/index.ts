/**
 * FEATURE: logic nodes (`editor.nodes`).
 *
 * Every node made with `makeLogicNode` goes in this array. You can also make `editor.nodes` a
 * function of `env` (`(env) => [...]`) when the list depends on config or internals. The editor
 * re-evaluates it when they change. Backend nodes are in features/backend, and the node that
 * writes a project file is in features/files.
 *
 * | File | Shows |
 * |------|-------|
 * | function.ts    | exec flow: in_exec → method → out_exec |
 * | operation.ts   | pure data node, one method per output |
 * | branch.ts      | several exec outputs, internal_* state, why macros are avoided |
 * | async.ts       | `{ async, sync }` methods, `dynamic` exec pins |
 * | node-config.ts | per-instance `config` + `this.config` + generate({ config }) |
 * | dynamic.ts     | dynamic enum from internals, generic output type |
 * | multiple.ts    | variadic `multiple: true` input |
 * | types.ts       | object/array/record/union/interface/function, Static, LogicUtil |
 * | documented.ts  | display (icon, hue, altSearch) + documentation (examples, parameters) |
 * | scopes.ts      | Shared / Frontend scopes, shared entry import |
 * | codegen.ts     | build.generate, build.imports, build.define, this.instance |
 *
 * Docs: docs/04-nodes.md
 */
import type { TLogicNode } from "@luna-park/plugin";

import { asyncNode } from "@/features/nodes/async.ts";
import { branchNode } from "@/features/nodes/branch.ts";
import { reactiveNode, slugifyNode } from "@/features/nodes/codegen.ts";
import { documentedNode } from "@/features/nodes/documented.ts";
import { dynamicEnumNode, dynamicTypeNode } from "@/features/nodes/dynamic.ts";
import { functionNode } from "@/features/nodes/function.ts";
import { multipleNode } from "@/features/nodes/multiple.ts";
import { nodeConfigNode } from "@/features/nodes/node-config.ts";
import { operationNode } from "@/features/nodes/operation.ts";
import { frontendNode, sharedNode } from "@/features/nodes/scopes.ts";
import { typesNode } from "@/features/nodes/types.ts";

export const exampleNodes: Array<TLogicNode> = [
    functionNode,
    operationNode,
    branchNode,
    asyncNode,
    nodeConfigNode,
    dynamicEnumNode,
    dynamicTypeNode,
    multipleNode,
    typesNode,
    documentedNode,
    sharedNode,
    frontendNode,
    slugifyNode,
    reactiveNode
];
