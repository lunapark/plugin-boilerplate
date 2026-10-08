/**
 * ENTRY `<package>/shared`: isomorphic code for **both** generated frontends and backends.
 *
 * Imported by `ELogicScope.Shared` nodes and by interface constants (`Money.parse`).
 * Rules: no DOM, no Node built-ins, no Vue.
 *
 * Docs: docs/14-packaging.md
 */
export { Money } from "@/features/interfaces/money.ts";
export { formatGreeting } from "@/features/nodes/shared.ts";
