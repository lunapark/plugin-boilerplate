/**
 * Merges the code injections of several features into one `build.injections` record.
 *
 * `build.injections` takes a single `Partial<Record<EInjectionKey, string>>`. Each feature
 * builds its own record, and this helper joins the strings for each key with a newline,
 * in the order given.
 *
 * See docs/11-build-and-codegen.md.
 */
import type { EInjectionKey } from "@luna-park/plugin";

export type TInjections = Partial<Record<EInjectionKey, string>>;

export function mergeInjections(...records: Array<TInjections>): TInjections {
    const merged: TInjections = {};

    for (const record of records) {
        for (const [key, code] of Object.entries(record) as Array<[EInjectionKey, string]>) {
            merged[key] = merged[key] ? `${ merged[key] }\n${ code }` : code;
        }
    }

    return merged;
}
