/**
 * SHARED logic for the hooks and guards examples: a "visitor" read from a cookie.
 *
 * The editor (hooks, guard `check`) and the generated server (`<package>/server`, preHandler,
 * guard `build.generate`) use the same functions, so both behave the same.
 *
 * This file is bundled into the server entry, so it must not import `@luna-park/plugin`, Vue or
 * any other editor code. The editor-side schema (`visitorSchema`) lives in ./index.ts.
 */

export const VISITOR_COOKIE = "bp_visitor";

/** Context key set by the middleware. It is also the output key added to the route input node. */
export const VISITOR_CONTEXT_KEY = "in_visitor";

export type TVisitor = {
    id: string;
    known: boolean;
};

export function resolveVisitor(cookie?: string): TVisitor {
    return cookie ? { id: cookie, known: true } : { id: "anonymous", known: false };
}

/** Error with an HTTP status: Fastify answers with it when a preHandler throws. */
function forbidden(message: string) {
    return Object.assign(new Error(message), { statusCode: 403 });
}

export function assertKnownVisitor(visitor?: TVisitor) {
    if (!visitor?.known) {
        throw forbidden(`Unknown visitor: set the "${ VISITOR_COOKIE }" cookie first.`);
    }
}

export function assertVisitorAllowed(visitor: TVisitor | undefined, allowed: string) {
    const ids = allowed.split(",").map((id) => id.trim()).filter(Boolean);

    if (!visitor || !ids.includes(visitor.id)) {
        throw forbidden(`Visitor "${ visitor?.id ?? "anonymous" }" is not allowed.`);
    }
}
