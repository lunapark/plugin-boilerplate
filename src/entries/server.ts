/**
 * ENTRY `<package>/server`: Node code imported by **generated backends**.
 *
 * Everything that generated backend code imports from SERVER_TARGET must be exported here:
 * - injections: ServerImport;
 * - backend nodes and guards: `build.imports`.
 *
 * Rules: no DOM, no Vue, no `@luna-park/plugin`. This bundle runs in plain Node. vite.config.ts
 * keeps CSS injection out of it.
 *
 * Docs: docs/12-backend.md, docs/14-packaging.md
 */
export * from "@/entries/shared.ts";
export { signText } from "@/features/backend/crypto.ts";
export { configureBoilerplateServer, getServerStatus, type TServerSettings, type TServerStatus } from "@/features/backend/server.ts";
export { assertKnownVisitor, assertVisitorAllowed, resolveVisitor, type TVisitor } from "@/features/hooks/visitor.ts";
