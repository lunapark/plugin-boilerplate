/**
 * SERVER runtime: runs inside the generated backend (Node + Fastify).
 *
 * Exported from `<package>/server` (src/entries/server.ts). The generated `server.ts` imports
 * it through the `ServerImport` injection, and backend nodes through `build.imports`.
 *
 * - Node APIs are fine here; browser APIs and Vue are not.
 * - Values from the build (`process.env.*` secrets, config) come in through `configure…()`,
 *   which the `ServerBody` injection calls once at startup.
 * - Module-level state (`settings`) lives for the server's whole lifetime.
 */
export type TServerSettings = {
    apiKey: string;
    signature: string;
};

const settings: TServerSettings = {
    apiKey: "",
    signature: ""
};

const startedAt = new Date();

export function configureBoilerplateServer(value: Partial<TServerSettings>) {
    Object.assign(settings, value);
}

/** Response of the injected `GET <prefix>/_boilerplate/status` route. */
export function getServerStatus() {
    return {
        hasApiKey: !!settings.apiKey,
        signature: settings.signature,
        uptime: Math.round((Date.now() - startedAt.getTime()) / 1000)
    };
}

export type TServerStatus = ReturnType<typeof getServerStatus>;
