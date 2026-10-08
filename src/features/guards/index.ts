/**
 * FEATURE: route guards (`editor.guards`).
 *
 * A guard is a reusable access check that users attach to backend routes, in the route's
 * settings. Each guard has:
 * - `id`, referenced as `<pluginId>/<id>`, plus `label` and `description` for the UI;
 * - `config` (optional): an object schema the user fills in per route;
 * - `check({ config, context })`: runs in the **editor** after the BackendMiddleware hooks.
 *   `context` holds what they set. Throw to reject the request;
 * - `build.generate(config)`: JS source of an async Fastify preHandler `(request) => …` for
 *   the generated route. `request.context` holds what the preHandler hooks set. Throw (ideally
 *   with `statusCode`) to reject;
 * - `build.imports`: imports needed by that code.
 *
 * Guards usually rely on a middleware (see features/hooks) to put the user or visitor in the
 * context.
 *
 * Docs: docs/12-backend.md
 */
import type { TRouteGuard } from "@luna-park/plugin";
import { LogicType } from "@luna-park/plugin";

import type { TVisitor } from "@/features/hooks/visitor.ts";
import { assertKnownVisitor, assertVisitorAllowed, VISITOR_CONTEXT_KEY } from "@/features/hooks/visitor.ts";
import { SERVER_TARGET } from "@/meta.ts";

/** Guard without config. */
const knownVisitorGuard: TRouteGuard = {
    id: "known-visitor",
    build: {
        generate: () => `async (request) => assertKnownVisitor(request.context.${ VISITOR_CONTEXT_KEY })`,
        imports: [{ name: "assertKnownVisitor", target: SERVER_TARGET }]
    },
    check: ({ context }) => assertKnownVisitor(context[VISITOR_CONTEXT_KEY] as TVisitor),
    description: "Only visitors with the `bp_visitor` cookie can call this route.",
    label: "Known visitor"
};

/** Guard with a per-route config form. */
const allowlistGuard: TRouteGuard = {
    id: "visitor-allowlist",
    build: {
        generate: (config) => `async (request) => assertVisitorAllowed(request.context.${ VISITOR_CONTEXT_KEY }, ${ JSON.stringify(String(config.ids ?? "")) })`,
        imports: [{ name: "assertVisitorAllowed", target: SERVER_TARGET }]
    },
    check: ({ config, context }) => assertVisitorAllowed(context[VISITOR_CONTEXT_KEY] as TVisitor, String(config.ids ?? "")),
    config: LogicType.object({
        ids: LogicType.string({ name: "Allowed ids", description: "Comma-separated visitor ids", placeholder: "alice, bob" })
    }),
    description: "Only the listed visitor ids can call this route.",
    label: "Visitor allowlist"
};

export const guards: Array<TRouteGuard> = [knownVisitorGuard, allowlistGuard];
