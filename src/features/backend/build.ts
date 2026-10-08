/**
 * BUILD: what the plugin adds to the generated project.
 *
 * - `build.frontImports` / `build.backImports`: npm packages added to the generated frontend /
 *   backend `package.json`. List your own package whenever generated code imports
 *   `<package>/runtime|server|shared`, plus any third-party library that code needs.
 * - `build.env`: entries appended to the generated `.env` (`KEY='value'`). This is how secrets
 *   reach production without ever being written into source code.
 * - `build.injections`: code inserted at fixed points of the generated app (see
 *   docs/11-build-and-codegen.md for the full list). The server injections are:
 *   - `ServerImport`: top of `backend/src/server.ts`;
 *   - `ServerBody`: inside `start()`, after cookies and the request context are registered and
 *     before routes are autoloaded. In scope:
 *     - `server`: the Fastify instance;
 *     - `serverConfig`: `{ host, port, prefix, secret, ... }`.
 *     Modules: `@/database/index.js` (dbFind, dbInsert, addDbScope, onDbChange, ...) and
 *     `@/context.js` (getRequestContext).
 *
 * Every function receives `env` (`{ config, internals, app, mode: "build" }`).
 *
 * Docs: docs/11-build-and-codegen.md, docs/12-backend.md
 */
import { EInjectionKey } from "@luna-park/plugin";

import type { TInternals } from "@/features/internals/internals.ts";
import type { TInjections } from "@/lib/injections.ts";
import { ENV_PREFIX, PACKAGE_NAME, PACKAGE_VERSION, SERVER_TARGET } from "@/meta.ts";

/** Name of the env variable holding the secret. */
export const API_KEY_ENV = `${ ENV_PREFIX }_API_KEY`;

/** The generated apps install this package so they can import its runtime/server/shared entries. */
export const packageImport = { name: PACKAGE_NAME, version: PACKAGE_VERSION };

export function getEnv({ internals }: { internals: TInternals; }): Record<string, string> {
    return { [API_KEY_ENV]: internals.apiKey };
}

export function getBackendInjections({ internals }: { internals: TInternals; }): TInjections {
    // language=JavaScript
    const serverImport = `import { configureBoilerplateServer, getServerStatus } from "${ SERVER_TARGET }";`;

    // language=JavaScript
    const serverBody = `
configureBoilerplateServer({
    apiKey: process.env.${ API_KEY_ENV } ?? "",
    signature: ${ JSON.stringify(internals.signature) }
});

await server.register(async (boilerplate) => {
    boilerplate.get("/_boilerplate/status", async () => getServerStatus());
}, { prefix: serverConfig.prefix });
`;

    return {
        [EInjectionKey.ServerImport]: serverImport,
        [EInjectionKey.ServerBody]: serverBody
    };
}
