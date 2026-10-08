/**
 * NODES: backend node + frontend node calling an injected backend route.
 *
 * A node that runs in two different places:
 * - `methods` run in the **editor**, whose backend is simulated in the browser. Use the editor's
 *   data (`internals`, simulated cookies, editor databases), or just log what would happen
 *   (the Mail plugin logs instead of sending emails);
 * - `build.generate` + `build.imports` produce the code of the **real** server, which reads
 *   secrets from `process.env` and calls `<package>/server` helpers.
 *
 * Docs: docs/12-backend.md
 */
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { API_KEY_ENV } from "@/features/backend/build.ts";
import { signText } from "@/features/backend/crypto.ts";
import type { TServerStatus } from "@/features/backend/server.ts";
import { internals } from "@/features/internals/internals.ts";
import { log } from "@/lib/env.ts";
import { SERVER_TARGET } from "@/meta.ts";

/** Backend-only node. The secret comes from internals in the editor and from `.env` in production. */
export const signNode = makeLogicNode({
    name: "backend/sign",
    inputs: {
        in_exec: LogicType.exec(),
        in_text: LogicType.string({ name: "text" })
    },
    outputs: {
        out_exec: LogicType.exec(),
        out_signature: LogicType.string({ name: "signature" })
    },
    methods: {
        async in_exec() {
            this.out_signature = await signText(internals.apiKey, this.in_text);
            return this.out_exec();
        }
    },
    display: {
        name: "Sign text (backend)",
        config: {
            scope: ELogicScope.Backend
        }
    },
    documentation: {
        short: "Sign a text with the plugin's secret API key",
        description: "Computes an HMAC-SHA256 of `text` with the API key set in the plugin settings. In production the key is read from the `.env` file."
    },
    build: {
        generate: () => `async function () {
            this.out_signature = await signText(process.env.${ API_KEY_ENV } ?? "", this.in_text);
            return this.out_exec();
        }`,
        imports: [{ name: "signText", target: SERVER_TARGET }]
    }
});

/**
 * Frontend node that calls the route registered by the `ServerBody` injection.
 * `route()` from the generated app's `@/utils/api` sends the request to the backend URL,
 * prefix included, with credentials.
 */
export const statusNode = makeLogicNode({
    name: "backend/status",
    inputs: {
        in_exec: LogicType.exec()
    },
    outputs: {
        out_exec: LogicType.exec(),
        out_status: LogicType.object({
            hasApiKey: LogicType.boolean({ name: "hasApiKey" }),
            signature: LogicType.string({ name: "signature" }),
            uptime: LogicType.number({ name: "uptime" })
        }, { name: "status" })
    },
    methods: {
        in_exec() {
            // The editor's simulated backend doesn't run injected Fastify routes, so fake the answer.
            this.out_status = { hasApiKey: !!internals.apiKey, signature: internals.signature, uptime: 0 } satisfies TServerStatus;
            log("Boilerplate: /_boilerplate/status is simulated in the editor.");
            return this.out_exec();
        }
    },
    display: {
        name: "Server status (frontend → backend)",
        config: {
            scope: ELogicScope.Frontend
        }
    },
    documentation: {
        short: "Ask the backend for the plugin's status",
        description: "Calls `GET /_boilerplate/status`, a route the plugin injects into the generated backend."
    },
    build: {
        generate: () => `async function () {
            this.out_status = await route({ method: "get", url: "/_boilerplate/status" });
            return this.out_exec();
        }`,
        imports: [{ name: "route", target: "@/utils/api" }]
    }
});

export const backendNodes = [signNode, statusNode];
